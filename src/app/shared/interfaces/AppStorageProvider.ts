import { BehaviorSubject, Observable } from "rxjs";
import { AppStorage } from "./AppStorage"; 

export interface AppStorageProvider {
    periods$: Observable<{name: string, id: string}[]>;
    selectedPeriod$: BehaviorSubject<string|null>;
    periodAppStorage$: Observable<AppStorage>;
    saveAppStorage(appStorage: AppStorage): Promise<void>;
}