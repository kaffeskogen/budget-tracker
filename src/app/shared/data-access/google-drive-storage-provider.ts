import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, map, mergeMap, of, firstValueFrom, EMPTY, fromEvent, BehaviorSubject, throwError, combineLatest, shareReplay, combineLatestWith } from "rxjs";
import { AppStorage } from "../interfaces/AppStorage";
import { environment } from "src/environments/environment";
import { Oauth2TokenResponse } from "../auth/auth.service";
import { Injectable, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RxJsLoggingLevel, debug } from "../utils/rxjs-debug";
import { MOCK_TRANSACTIONS } from "../mocks/transactions";
import { MOCK_GROUPS } from "../mocks/groups";

export interface GoogleDriveAppData {
    storageFileId: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class GoogleDriveStorageProvider implements AppStorageProvider {
    http = inject(HttpClient);

    tokenResponse$ = fromEvent<MessageEvent>(window, 'message');
    token$ = this.tokenResponse$
        .pipe(
            debug(RxJsLoggingLevel.DEBUG, 'Getting token...'),
            takeUntilDestroyed(),
            map(event => event.data as Oauth2TokenResponse),
            map(response => response.access_token),
            mergeMap(token => token ? of(token) : EMPTY),
            debug(RxJsLoggingLevel.DEBUG, 'Got token!'),
            shareReplay(1)
        );

    googleDriveAppDataFolderContents$ = this.token$.pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Getting g-drive app data folder contents...'),
        mergeMap(token => !token ?
            EMPTY :
            this.http.get<{ files: { name: string, id: string }[] }>('https://www.googleapis.com/drive/v3/files', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { spaces: 'appDataFolder', fields: 'files(id, name)', pageSize: '1000' }
            }).pipe(
                map(response => response.files),
            )
        ),
        debug(RxJsLoggingLevel.DEBUG, 'Got g-drive app data folder contents!'),
        shareReplay(1)
    )

    googleDriveConfigFileId$ = this.googleDriveAppDataFolderContents$
        .pipe(
            debug(RxJsLoggingLevel.DEBUG, 'Getting g-drive config file id...'),
            map(files => files.find(file => file.name === 'google-drive-config.json')),
            mergeMap(file => file?.id ? of(file?.id) : this.createGoogleDriveConfigFile('google-drive-config.json')),
            debug(RxJsLoggingLevel.DEBUG, 'Got g-drive config file id!'),
            shareReplay(1),
        );

    googleDriveConfig$ = this.googleDriveConfigFileId$.pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Getting g-drive config...'),
        mergeMap(fileId => fileId ?
            this.getFileContents<GoogleDriveAppData>(fileId) :
            of({ storageFileId: null })),
        shareReplay(1),
        debug(RxJsLoggingLevel.DEBUG, 'Got g-drive config!')
    );

    appFolderId$ = this.googleDriveConfig$.pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Getting app folder id...'),
        takeUntilDestroyed(),
        mergeMap(googleDriveConfig => googleDriveConfig?.storageFileId
            ? of(googleDriveConfig.storageFileId)
            : this.createFolder(window.location.hostname)
                .pipe(
                    debug(RxJsLoggingLevel.DEBUG, '- Created app folder'),
                    combineLatestWith(this.googleDriveConfigFileId$),
                    debug(RxJsLoggingLevel.DEBUG, '- Combined with googleDriveConfigFileId$'),
                    mergeMap(([folderId, fileId]) =>
                        this.saveFileContents(fileId, JSON.stringify({ storageFileId: folderId }))
                            .pipe(map(() => folderId))
                    ),
                    debug(RxJsLoggingLevel.DEBUG, '- Saved file in app folder'),
                )
        ),
        debug(RxJsLoggingLevel.DEBUG, 'Got app folder id!'),
        shareReplay(1),
    );

    appFolderContents$ = this.appFolderId$.pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Getting app folder contents...'),
        takeUntilDestroyed(),
        mergeMap(folderId => folderId ? this.getFolderItems(folderId) : EMPTY),
        debug(RxJsLoggingLevel.DEBUG, 'Got app folder contents!'),
        shareReplay(1)
    );

    defaultPeriod = [
        new Date().getFullYear().toString(),
        (new Date().getMonth() + 1).toString().padStart(2, '0')
    ].join('-')

    selectedPeriod$ = new BehaviorSubject<string>(this.defaultPeriod);

    periods$: Observable<{ name: string, id: string }[]> = this.appFolderContents$
        .pipe(
            map(files => files.map((file: any) => ({ name: file.name, id: file.id })))
        );

    periodAppStorage$: Observable<AppStorage> = combineLatest([
        this.periods$,
        this.selectedPeriod$
    ]).pipe(
        debug(RxJsLoggingLevel.DEBUG, 'Getting selected period file contents...'),
        map(([periods, selectedPeriod]) => selectedPeriod && periods.find((period) => period.name === selectedPeriod)),
        mergeMap(period => period ? this.getFileContents<AppStorage>(period.id) : of({
            transactions: MOCK_TRANSACTIONS,
            groups: MOCK_GROUPS
        })),
        mergeMap(data => data ? of(data) : EMPTY),
        debug(RxJsLoggingLevel.DEBUG, 'Got selected period file contents!'),
        shareReplay(1)
    );

    constructor() {
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


    async saveAppStorage(appStorage: AppStorage): Promise<void> {
        const selectedPeriod = this.selectedPeriod$.value;
        let periodFileId = await firstValueFrom(this.periods$.pipe(map(periods => periods.find(period => period.name === selectedPeriod)?.id)));
        if (!periodFileId) {
            periodFileId = await firstValueFrom(
                this.appFolderId$.pipe(
                    mergeMap(folderId => folderId ? this.createFile(folderId, selectedPeriod) : throwError(() => new Error('No app id'))),
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
                }).pipe(map(response => response.files))
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
                }).pipe(map(response => response.files))
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
                        'Authorization': `Bearer ${token}`
                    }
                }).pipe(map(() => { })) : EMPTY
            )
        );
    }

    async setAppStorageFolderId(folderId: string): Promise<void> {

        const googleDriveConfigFileId = await firstValueFrom(this.googleDriveConfigFileId$);

        const googleDriveAppData = {
            storageFileId: folderId
        } satisfies GoogleDriveAppData;

        await firstValueFrom(this.saveFileContents(googleDriveConfigFileId, JSON.stringify(googleDriveAppData)));
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