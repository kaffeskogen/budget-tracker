import { Injectable } from "@angular/core";
import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, map, mergeMap, of } from "rxjs";
import { AppStorage } from "../interfaces/AppStorage";
import { MOCK_APP_STORAGE } from "../mocks/appdata";

interface Oauth2Token {
    access_token: string;
    expires_in: number;
};

interface GoogleDriveAppData {
    storageFileId: string|null;
}

export class GoogleDriveStorageProvider implements AppStorageProvider {
    private oauth2Token: Oauth2Token;
    private http: HttpClient

    constructor(httpClient: HttpClient, oauth2Token: Oauth2Token) {
        this.oauth2Token = oauth2Token;
        this.http = httpClient;
    }

    get token() {
        return this.oauth2Token.access_token;
    }

    $obs?: Observable<AppStorage>;

    getAppStorage(): Observable<AppStorage> {
        if (!this.$obs) {
            this.$obs = this.getGoogleDriveAppData().pipe(
                map(data => data.storageFileId),
                mergeMap((fileId: string|null) => fileId ?
                    this.getFileContents<AppStorage>(fileId) :
                    this.createFile(null, 'appData.json').pipe(
                        mergeMap(id => this.saveFileContents('appData.json', JSON.stringify({ storageFileId: id }))),
                    )
                ),
                map(contents => contents || MOCK_APP_STORAGE)
            );
        }
        return this.$obs;
    }

    getGoogleDriveAppData(): Observable<GoogleDriveAppData> {
        return this.getFileContentsByFileName<GoogleDriveAppData>('appDataFolder', 'appData.json')
            .pipe(
                tap(data => console.log(`Got app data: ${JSON.stringify(data)}`)),
                map(data => data || { storageFileId: null })
            );
    }

    createFile(spaces: string|null, fileName: string): Observable<string> {
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
            tap(() => console.log(`Getting file ${fileName}...`)),
            map(files => files.find(file => file.name === fileName)),
            tap(file => console.log(file?.id ? `File ${fileName} found, returning contents` : `File ${fileName} not found, returning null`)),
            map(file => file?.id || null),
            mergeMap(fileId => fileId ? this.getFileContents<T>(fileId) : of(null))
        )
    }

    saveFileContents(fileName: string, contents: string): Observable<void> {
        return this.getListOfFiles('appDataFolder').pipe(
            tap(() => console.log(`Finding file ${fileName}`)),
            map(files => files.find(file => file.name === fileName)),
            tap(file => console.log(file?.id ? `File ${fileName} found` : `File ${fileName} not found`)),
            mergeMap(file => {
                if (file) {
                    return of(file);
                }
                console.log(`Creating file ${fileName}`);
                return this.http.post('https://www.googleapis.com/drive/v3/files', {
                    name: fileName,
                    parents: ['appDataFolder']
                },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }
                );
            }),
            mergeMap((response: any) => {
                console.log(`Patching file ${fileName}`);
                return this.http.patch(`https://www.googleapis.com/upload/drive/v3/files/${response?.id}`, contents, {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Content-Length': contents.length.toString(),
                        'Authorization': `Bearer ${this.token}`
                    }
                }).pipe(map(() => { }));
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

}