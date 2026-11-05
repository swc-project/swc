// https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules
export { };
declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export var sep: string;
}

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
declare global {
    interface Array<T> {
        toObservable(): Observable<T>;
    }
}
