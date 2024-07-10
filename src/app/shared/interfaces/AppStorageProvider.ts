import { BehaviorSubject, Observable } from "rxjs";
import { AppStorage } from "./AppStorage"; 

export interface AppStorageProvider {
    periods$: Observable<{name: string, id: string}[]>;
    selectedPeriod$: BehaviorSubject<string>;
    periodAppStorage$: Observable<AppStorage>;
    saveAppStorage(appStorage: AppStorage): Promise<void>;
    setAppStorageFolder(folder: {id: string, name: string}): Promise<void>;
    addStorageFile(file: {id: string, name: string}): Promise<void>;
    getFileMetadata(fileId: string): Promise<{name: string, id: string}>;
}