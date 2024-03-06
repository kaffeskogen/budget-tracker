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

  getFileContentsOrEmptyString(fileName: string) {
    return this.getListOfFiles().pipe(
      map(files => files.find(file => file.name === fileName)),
      map(file => file?.id || ''),
      mergeMap(fileId => fileId ? this.getFileContents(fileId) : of(''))
    )
  }

  saveFileContents(fileName: string, contents: string): Observable<void> {
    return this.getListOfFiles().pipe(
      map(files => files.find(file => file.name === fileName)),
      mergeMap(file => {
        if (file) {
          return of(file);
        }
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

  getFileContents(fileId: string): Observable<string> {
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
