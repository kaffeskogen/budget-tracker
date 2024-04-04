import { Injectable, Signal, computed, effect, inject, signal, untracked } from '@angular/core';
import { Subject } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { Group } from '../interfaces/Group';
import { Transaction } from '../interfaces/Transaction';
import { ToastService } from '../ui/toast/toast.service';

export interface TransactionGroupsServiceState {
    groups: Group[];
    status: 'error' | 'success' | 'loading';
    error: string | null;
    save: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class TransactionGroupsService {

    storageService = inject(StorageService);
    toast = inject(ToastService);

    groupsLoaded$ = this.storageService.groups$;

    add$ = new Subject<Group>();
    remove$ = new Subject<Group>();
    edit$ = new Subject<Group>();

    private state = signal<TransactionGroupsServiceState>({
        groups: [],
        status: 'loading',
        error: null,
        save: false
    });

    groups = computed(() => this.state().groups);
    status = computed(() => this.state().status);
    error = computed(() => this.state().error);
    save = computed(() => this.state().save);

    group(id: string): Signal<Group | undefined> {
        return computed(() => this.groups()?.find((t) => t.id === id));
    }

    constructor() {

        this.groupsLoaded$
            .pipe(takeUntilDestroyed())
            .subscribe({
                next: (groups) => {
                    if (!groups) return;
                    this.state.update((state) => ({
                        ...state,
                        groups,
                        save: false,
                        status: 'success'
                    } satisfies TransactionGroupsServiceState))
                },
                error: (err) => this.state.update((state) => ({ ...state, status: 'error', error: err }))
            });

        this.add$
            .pipe(takeUntilDestroyed())
            .subscribe((group) => {
                console.log('Adding group', group);
                this.state.update((state) => ({
                    ...state,
                    save: true,
                    groups: [
                        ...state.groups,
                        {
                            ...group
                        }
                    ]
                } satisfies TransactionGroupsServiceState))
            });

        this.edit$
            .pipe(takeUntilDestroyed())
            .subscribe((update) =>
                this.state.update((state) => ({
                    ...state,
                    save: true,
                    groups: state.groups.map((item) =>
                        item.id === update.id ? { ...update } : item
                    ),
                } satisfies TransactionGroupsServiceState))
            );

        this.remove$
            .pipe(takeUntilDestroyed())
            .subscribe((group) => {
                this.state.update((state) => ({
                    ...state,
                    save: true,
                    groups: state.groups.filter((item) => item.id !== group.id),
                } satisfies TransactionGroupsServiceState));
                this.toast.show(`Group ${group.name} removed`);
            }
        );


        effect(() => {
            if(!this.save()) {
                return;
            }

            console.log('saving groups', this.groups());
            this.storageService.saveGroups(this.groups());
            return;

        });
    }
}