import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, map, mergeMap, of, firstValueFrom, EMPTY, switchMap, fromEvent, tap, BehaviorSubject, pipe } from "rxjs";
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
    private token$ = new BehaviorSubject<string | null>(null)
    private appData$ = this.getFileContentsByFileName<GoogleDriveAppData>('appDataFolder', 'google-drive-config.json')
        .pipe(map(data => data || { storageFileId: null }));

    public fileId$ = new BehaviorSubject<string | null>(null);

    appStorage$ = this.fileId$.pipe(
        mergeMap(fileId => fileId ? this.getFileContents<AppStorage>(fileId) : EMPTY)
    );

    constructor() {

        this.appData$
            .subscribe(data => this.fileId$.next(data.storageFileId));

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

    getAppStorage(): Observable<AppStorage> {
        return this.appStorage$;
    }

    async saveAppStorage(appStorage: AppStorage): Promise<void> {
        const appData = await firstValueFrom(this.appData$);
        if (!appData?.storageFileId) {
            throw new Error('No storage file found');
        }
        await firstValueFrom(this.saveFileContentsById(appData.storageFileId, JSON.stringify(appStorage)));
    }

    createFile(spaces: string | null, fileName: string): Observable<string> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: fileName,
                    parents: [spaces]
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

    getFileContentsByFileName<T>(spaces: string, fileName: string): Observable<T | null> {
        return this.getListOfFiles(spaces).pipe(
            map(files => files.find(file => file.name === fileName)),
            map(file => file?.id || null),
            mergeMap(fileId => fileId ? this.getFileContents<T>(fileId) : of(null))
        )
    }

    saveFileContents(spaces: string, fileName: string, contents: string): Observable<void> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.getListOfFiles('appDataFolder').pipe(
                    map(files => files.find(file => file.name === fileName)),
                    mergeMap(file => {
                        if (file) {
                            return of(file);
                        }
                        return this.http.post('https://www.googleapis.com/drive/v3/files', {
                            name: fileName,
                            parents: [spaces]
                        },
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );
                    }),
                    mergeMap((response: any) => {
                        return this.saveFileContentsById(response?.id, contents);
                    }),
                ) : EMPTY
            )
        );
    }

    getListOfFiles(spaces: string): Observable<{ id: string, name: string }[]> {
        return this.token$.pipe(
            mergeMap(token => token ?
                this.http.get<{ files: any[] }>('https://www.googleapis.com/drive/v3/files', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        spaces: spaces,
                        fields: 'files(id, name)',
                        pageSize: '1000'
                    }
                }).pipe(
                    map(response => response.files)
                ) : EMPTY
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

    saveFileContentsById(fileId: string, contents: string): Observable<void> {
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

}