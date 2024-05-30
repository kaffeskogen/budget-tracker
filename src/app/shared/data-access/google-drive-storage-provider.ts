import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, map, mergeMap, of, firstValueFrom, EMPTY, switchMap, fromEvent, tap, BehaviorSubject, pipe, merge, concat, zip, find, zipWith } from "rxjs";
import { AppStorage } from "../interfaces/AppStorage";
import { environment } from "src/environments/environment";
import { Oauth2TokenResponse } from "../auth/auth.service";
import { Injectable, WritableSignal, computed, inject, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

export interface GoogleDriveAppData {
    storageFileId: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class GoogleDriveStorageProvider implements AppStorageProvider {
    http = inject(HttpClient);

    private tokenResponse$ = fromEvent<MessageEvent>(window, 'message');
    private token$ = new BehaviorSubject<string | null>(null);

    constructor() {

        this.tokenResponse$
            .pipe(
                map(event => event.data as Oauth2TokenResponse),
            ).subscribe(response => {
                if (response.access_token) {
                    this.token$.next(response.access_token);
                }
            });

        this.openPopup();
    }

    async openPopup() {
        const endpoint = 'https://accounts.google.com/o/oauth2/auth';
        const params = {
            client_id: environment.oauth2.google_client_id,
            scope: [
                'https://www.googleapis.com/auth/drive.appdata',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.install'
            ].join(' '),
            response_type: 'token',
            redirect_uri: window.location.origin + '/oauth2.html',
        };

        const url = endpoint + '?' + new URLSearchParams(params).toString();
        window.open(url, 'kaffeskogen-oauth', 'popup,height=570,width=520');
    }

    
    private googleDriveAppDataFolderContents$ = this.token$.pipe(
        mergeMap(token => !token ?
            EMPTY :
            this.http.get<{ files: {name:string, id: string}[] }>('https://www.googleapis.com/drive/v3/files', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { spaces: 'appDataFolder', fields: 'files(id, name)', pageSize: '1000' }
            }).pipe( map(response => response.files) )
        )
    )

    googleDriveConfigFileId$ = this.googleDriveAppDataFolderContents$
        .pipe(
            map(files => files.find(file => file.name === 'google-drive-config.json')),
            mergeMap(file => file?.id ? of(file?.id) : this.createGoogleDriveConfigFile('google-drive-config.json'))
        );

    googleDriveConfig$ = this.googleDriveConfigFileId$.pipe(
        mergeMap(fileId => fileId ?
            this.getFileContents<GoogleDriveAppData>(fileId) :
            of({ storageFileId: null }))
    );
    
    appFolderId$ = this.googleDriveConfig$.pipe(
        mergeMap(googleDriveConfig => googleDriveConfig?.storageFileId
            ? of(googleDriveConfig.storageFileId)
            : this.createFolder(window.location.hostname)
                .pipe(
                    zipWith(this.googleDriveConfigFileId$),
                    mergeMap(([folderId, fileId]) => 
                        this.saveFileContents(fileId, JSON.stringify({ storageFileId: folderId }))
                            .pipe(map(() => folderId))
                    )
                )
            )
    );

    appFolderContents$ = this.appFolderId$.pipe(
        mergeMap(folderId => this.getFolderItems(folderId))
    );

    periods$: Observable<{name: string, id: string}[]> = this.appFolderContents$.pipe(
        map(files => files.map((file: any) => ({name: file.name, id: file.id})))
    );

    selectedPeriod$ = new BehaviorSubject<string>([
        new Date().getFullYear().toString(),
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    ].join('-'));

    periodAppStorage$: Observable<AppStorage> = zip(
        this.periods$,
        this.selectedPeriod$
    ).pipe(
        map(([periods, selectedPeriod]) => selectedPeriod && periods.find((period) => period.name === selectedPeriod)),
        mergeMap(period => period ? this.getFileContents<AppStorage>(period.id) : of({ transactions: [], groups: [] })),
        mergeMap(data => data ? of(data) : EMPTY)
    );

    async saveAppStorage(appStorage: AppStorage): Promise<void> {
        const selectedPeriod = this.selectedPeriod$.value;
        let periodFileId = await firstValueFrom(this.periods$.pipe(map(periods => periods.find(period => period.name === selectedPeriod)?.id)));
        if (!periodFileId) {
            periodFileId = await firstValueFrom(
                this.appFolderId$.pipe(
                    mergeMap(folderId => this.createFile(folderId, selectedPeriod)),
                )
            );
        }

        return firstValueFrom(this.saveFileContents(periodFileId, JSON.stringify(appStorage)));
    }

    getFolderItems(folderId: string) {
        return this.token$.pipe(
            mergeMap(token => !token ?
                EMPTY :
                this.http.get<{ files: any[] }>('https://www.googleapis.com/drive/v3/files', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { 
                        spaces: 'drive', 
                        fields: 'files(id, name)', 
                        pageSize: '1000',
                        q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'` 
                    }
                }).pipe( map(response => response.files) )
            )
        );
    }

    getGoogleDriveAppData(): Observable<{ id: string, name: string }[]> {
        return this.token$.pipe(
            mergeMap(token => !token ?
                EMPTY :
                this.http.get<{ files: any[] }>('https://www.googleapis.com/drive/v3/files', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { spaces: 'appDataFolder', fields: 'files(id, name)', pageSize: '1000' }
                }).pipe( map(response => response.files) )
            )
        )
    }

    getFileContents<T>(fileId: string): Observable<T> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        alt: 'media'
                    }
                }) : EMPTY
            )
        );
    }
    
    saveFileContents(fileId: string, contents: string): Observable<void> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, contents, {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Content-Length': contents.length.toString(),
                        'Authorization': `Bearer ${token}`
                    }
                }).pipe(map(() => { })) : EMPTY
            )
        );
    }

    createFolder(name: string): Observable<string> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: name,
                    mimeType: 'application/vnd.google-apps.folder'
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                ).pipe(
                    map((response: any) => response.id)
                ) : EMPTY
            )
        );
    }

    createFile(parentFolderId: string, fileName: string): Observable<string> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: fileName,
                    parents: [parentFolderId]
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                ).pipe(
                    map((response: any) => response.id)
                ) : EMPTY
            )
        );
    }

    createGoogleDriveConfigFile(fileName: string): Observable<string> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: fileName,
                    parents: ['appDataFolder']
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                ).pipe(
                    map((response: any) => response.id)
                ) : EMPTY
            )
    );
    }
}