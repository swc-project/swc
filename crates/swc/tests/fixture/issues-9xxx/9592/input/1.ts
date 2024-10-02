export type SafeResult<T> = { data: T; error: undefined } | { data: undefined; error: any };

export const safe = <T>(fn: () => T): SafeResult<T> => {
    try {
        const data = fn();
        return { data, error: undefined };
    } catch (error) {
        return { data: undefined, error };
    }
};