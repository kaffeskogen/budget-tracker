import { BehaviorSubject, Observable } from "rxjs";
import { AppStorage } from "./AppStorage"; 

export interface AppStorageProvider {
    appFolderId$: BehaviorSubject<string|null>;
    periods$: Observable<{name: string, id: string}[]>;
    selectedPeriod$: BehaviorSubject<string>;
    periodAppStorage$: Observable<AppStorage>;
    saveAppStorage(appStorage: AppStorage): Promise<void>;
}