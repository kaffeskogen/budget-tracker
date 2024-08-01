import { BehaviorSubject, Observable } from "rxjs";
import { AppStorage } from "./AppStorage"; 

export interface AppStorageProvider {
    periods$: Observable<{name: string, id: string}[]>;
    selectedPeriod$: BehaviorSubject<string>;
    periodAppStorage$: Observable<AppStorage>;
    appFolderId$: Observable<string>;
    userProfile$: Observable<ProfileInfo>;
    saveAppStorage(appStorage: AppStorage): Promise<void>;
    setAppStorageFolder(folder: {id: string, name: string}): Promise<void>;
    addStorageFile(file: {id: string, name: string}): Promise<void>;
    removeStorageFile(file: {id: string, name: string}): Promise<void>;
    getFileMetadata(fileId: string): Promise<{name: string, id: string}>;
    isFolder(file: ItemMetadata): boolean;
}

export interface ItemMetadata {
    id: string,
    name: string,
}

export interface ProfileInfo {
    name: string;
    email: string;
    photoUrl: string;
}