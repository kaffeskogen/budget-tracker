import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, map, mergeMap, of, firstValueFrom, BehaviorSubject, EMPTY, switchMap, fromEvent, merge } from "rxjs";
import { AppStorage } from "../interfaces/AppStorage";
import { environment } from "src/environments/environment";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Oauth2TokenResponse } from "../auth/auth.service";
import { computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

interface Oauth2Token {
    access_token: string;
    expires_in: number;
};

interface GoogleDriveAppData {
    storageFileId: string | null;
}

export class GoogleDriveStorageProvider implements AppStorageProvider {
    private http: HttpClient;

    googleDriveAppData: BehaviorSubject<GoogleDriveAppData> = new BehaviorSubject<GoogleDriveAppData | null>(null)
        .pipe(
            switchMap(appdata => appdata ? of(appdata) : EMPTY)
        ) as BehaviorSubject<GoogleDriveAppData>;

    appStorage: BehaviorSubject<AppStorage> = new BehaviorSubject<AppStorage | null>(null)
        .pipe(
            switchMap(appdata => appdata ? of(appdata) : EMPTY)
        ) as BehaviorSubject<AppStorage>;

    private tokenResponse$ = fromEvent<MessageEvent>(window, 'message')
        .pipe(map(event => event.data satisfies Oauth2TokenResponse));
    
    private token: string = ''

    constructor(httpClient: HttpClient, fileId?: string) {
        this.http = httpClient;

        this.openPopup();

        this.tokenResponse$
            .pipe(
                mergeMap(tokenResponse => tokenResponse.access_token ? of(tokenResponse.access_token) : EMPTY)
            )
            .subscribe((token: string) => {

                this.token = token;

                of(fileId).pipe(
                    mergeMap(fileId => fileId ?
                        this._setGoogleDriveAppData({ storageFileId: fileId }) :
                        this._getGoogleDriveAppData()
                    ))
                    .subscribe({
                        next: value => this.googleDriveAppData.next(value)
                    });
        
                this._getAppStorage()
                    .pipe(switchMap(appdata => appdata ? of(appdata) : EMPTY))
                    .subscribe({
                        next: value => this.appStorage.next(value)
                    });
            })
            
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

    private _getAppStorage(): Observable<AppStorage | null> {
        return this.googleDriveAppData
            .pipe(
                map(data => data && data.storageFileId && data.storageFileId),
                tap(fileId => fileId ? console.log(`Found storage file ${fileId}`) : console.log('No storage file found, creating one')),
                mergeMap((fileId: string | null) =>
                    fileId
                        ? this.getFileContents<AppStorage>(fileId)
                        : this.createFile(null, 'budget-appen-data.json')
                            .pipe(mergeMap(id =>
                                this.saveFileContents('appDataFolder', 'google-drive-config.json', JSON.stringify({ storageFileId: id }))))
                ),
                map(contents => contents || null)
            );
    }

    private _setGoogleDriveAppData(appData: GoogleDriveAppData): Observable<GoogleDriveAppData> {
        return this.saveFileContents('appDataFolder', 'google-drive-config.json', JSON.stringify(appData))
            .pipe(map(() => appData));
    }


    getAppStorage(): Observable<AppStorage> {
        return this.appStorage;
    }

    async saveAppStorage(appStorage: AppStorage): Promise<void> {
        console.log('Saving 2');
        const appData = await firstValueFrom(this.googleDriveAppData);
        console.log('Saving 3');
        if (!appData?.storageFileId) {
            throw new Error('No storage file found');
        }
        console.log('Saving 4');
        await firstValueFrom(this.saveFileContentsById(appData.storageFileId, JSON.stringify(appStorage)));
    }

    private _getGoogleDriveAppData(): Observable<GoogleDriveAppData> {
        return this.getFileContentsByFileName<GoogleDriveAppData>('appDataFolder', 'google-drive-config.json')
            .pipe(map(data => data || { storageFileId: null }));
    }

    createFile(spaces: string | null, fileName: string): Observable<string> {
        return this.http.post('https://www.googleapis.com/drive/v3/files', {
            name: fileName,
            parents: [spaces]
        },
            {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            }
        ).pipe(
            map((response: any) => response.id)
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
        return this.getListOfFiles('appDataFolder').pipe(
            map(files => files.find(file => file.name === fileName)),
            mergeMap(file => {
                if (file) {
                    return of(file);
                }
                console.log(`Creating file ${fileName}`);
                return this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: fileName,
                    parents: [spaces]
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }
                );
            }),
            mergeMap((response: any) => {
                return this.saveFileContentsById(response?.id, contents);
            }),
        );
    }

    getListOfFiles(spaces: string): Observable<{ id: string, name: string }[]> {
        return this.http.get<{ files: any[] }>('https://www.googleapis.com/drive/v3/files', {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            params: {
                spaces: spaces,
                fields: 'files(id, name)',
                pageSize: '1000'
            }
        }).pipe(
            map(response => response.files)
        );
    }

    getFileContents<T>(fileId: string): Observable<T> {
        return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            params: {
                alt: 'media'
            }
        })
    }

    saveFileContentsById(fileId: string, contents: string): Observable<void> {
        return this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}`, contents, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': contents.length.toString(),
                'Authorization': `Bearer ${this.token}`
            }
        }).pipe(map(() => { }));
    }

}