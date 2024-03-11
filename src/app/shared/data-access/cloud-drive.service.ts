import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, filter, map, mergeMap, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudDriveService {
  authService = inject(AuthService);
  http = inject(HttpClient);
  files?: Promise<any[]>;

  getFileContentsByFileName<T>(fileName: string): Observable<T|null> {
    return this.getListOfFiles().pipe(
      tap(() => console.log(`Getting file ${fileName}...`)),
      map(files => files.find(file => file.name === fileName)),
      tap(file => console.log(file?.id ? `File ${fileName} found, returning contents` : `File ${fileName} not found, returning empty string`)),
      map(file => file?.id || null),
      mergeMap(fileId => fileId ? this.getFileContents<T>(fileId) : of(null))
    )
  }

  saveFileContents(fileName: string, contents: string): Observable<void> {
    return this.getListOfFiles().pipe(
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
              'Authorization': `Bearer ${this.authService.token()}`
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
            'Authorization': `Bearer ${this.authService.token()}`
          }
        }).pipe(map(() => { }));
      }),
    );
  }

  getListOfFiles(): Observable<{ id: string, name: string }[]> {
    return this.http.get<{ files: any[] }>('https://www.googleapis.com/drive/v3/files', {
      headers: {
        'Authorization': `Bearer ${this.authService.token()}`
      },
      params: {
        spaces: 'appDataFolder',
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
        'Authorization': `Bearer ${this.authService.token()}`
      },
      params: {
        alt: 'media'
      }
    })
  }
}
