import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, filter, map, mergeMap } from 'rxjs';

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
      filter(file => file !== undefined),
      map(file => file!.id),
      mergeMap(fileId => fileId ? this.getFileContents(fileId) : '')
    )
  }

  getListOfFiles(): Observable<{ id: string, name: string }[]> {
    return this.http.get<{files:any[]}>('https://www.googleapis.com/drive/v3/files', {
      params: {
        spaces: 'appDataFolder',
        fields: 'files(id, name)',
        pageSize: '10000'
      }
    }).pipe(
      map(response => response.files)
    );
  }

  getFileContents(fileId: string): Observable<string> {
    return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      params: {
        alt: 'media',
      }
    });
  }
}
