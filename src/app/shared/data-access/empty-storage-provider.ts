import { Observable, BehaviorSubject, of } from "rxjs";
import { AppStorage } from "../interfaces/AppStorage";
import { AppStorageProvider, ItemMetadata } from "../interfaces/AppStorageProvider";

export class EmptyStorageProvider implements AppStorageProvider {
    periods$ = of([{ name: '', id: '' }]);
    selectedPeriod$ = new BehaviorSubject('');
    periodAppStorage$ = of({} as AppStorage)
    appFolderId$ = of('');
    
    isFolder(file: ItemMetadata): boolean {
        throw new Error("Method not implemented.");
    }
    saveAppStorage(appStorage: AppStorage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    setAppStorageFolder(folder: { id: string; name: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addStorageFile(file: { id: string; name: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getFileMetadata(fileId: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

}