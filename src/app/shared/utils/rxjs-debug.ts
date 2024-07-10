import {MonoTypeOperatorFunction, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export enum RxJsLoggingLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}

let rxjsLoggingLevel = RxJsLoggingLevel.TRACE;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
    rxjsLoggingLevel = level;
}

export function debug<T>(level: RxJsLoggingLevel, message:string): MonoTypeOperatorFunction<T> {
    const data:MonoTypeOperatorFunction<T> = (source: Observable<T>) => source
        .pipe(
            tap(val => {
                if (level >= rxjsLoggingLevel) {
                    console.debug(message + ': ', val);
                }
            })
        );
    return data;
}