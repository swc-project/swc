namespace N {
    export interface Inferred { exported: true; }
}
namespace N {
    export type Extract<T> = T extends { value: infer Inferred } ? Inferred : never;
}
