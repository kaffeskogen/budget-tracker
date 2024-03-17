import { Observable } from "rxjs";
import { AppStorage } from "./AppStorage";

export interface AppStorageProvider {
    getAppStorage(): Observable<AppStorage>;
    saveAppStorage(appStorage: AppStorage): void;
}