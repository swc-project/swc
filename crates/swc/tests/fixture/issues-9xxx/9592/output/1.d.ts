export type SafeResult<T> = {
    data: T;
    error: undefined;
} | {
    data: undefined;
    error: any;
};
export declare const safe: <T>(fn: () => T) => SafeResult<T>;
