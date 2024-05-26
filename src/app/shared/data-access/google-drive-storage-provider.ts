import { AppStorageProvider } from "../interfaces/AppStorageProvider";
import { HttpClient } from "@angular/common/http";
import { Observable, map, mergeMap, of, firstValueFrom, EMPTY, switchMap, fromEvent, tap, BehaviorSubject, pipe, merge, concat, zip } from "rxjs";
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
    
    private googleDriveAppDataFolderContents$ = this.token$.pipe(
        mergeMap(token => !token ?
            EMPTY :
            this.http.get<{ files: {name:string, id: string}[] }>('https://www.googleapis.com/drive/v3/files', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { spaces: 'appDataFolder', fields: 'files(id, name)', pageSize: '1000' }
            }).pipe( map(response => response.files) )
        )
    )

    private googleDriveConfig$ = this.googleDriveAppDataFolderContents$
        .pipe(
            map(files => files.find(file => file.name === 'google-drive-config.json')),
            mergeMap(file => file?.id ? of(file?.id) : EMPTY),
            mergeMap((fileId: string) => fileId ? this.getFileContents<GoogleDriveAppData>(fileId) : of(null)),
            map(data => data || { storageFileId: null })
        );

    appFolderContents$ = this.googleDriveConfig$.pipe(
        map(data => data.storageFileId),
        mergeMap(folderId => folderId ? this.getFolderItems(folderId) : EMPTY)
    );

    periods$: Observable<{name: string, id: string}[]> = this.appFolderContents$.pipe(
        map(files => files.map((file: any) => ({name: file.name, id: file.id})))
    );

    selectedPeriod$ = new BehaviorSubject<string | null>(null);

    periodAppStorage$ = zip(
        this.periods$,
        this.selectedPeriod$
    ).pipe(
        map(([periods, selectedPeriod]) => selectedPeriod && periods.find((period) => period.name === selectedPeriod)),
        mergeMap(period => period ? this.getFileContents<AppStorage>(period.id) : EMPTY),
        mergeMap(data => data ? of(data) : EMPTY)
    );

    saveAppStorage(appStorage: AppStorage): Promise<void> {
        throw new Error("Method not implemented.");
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

}