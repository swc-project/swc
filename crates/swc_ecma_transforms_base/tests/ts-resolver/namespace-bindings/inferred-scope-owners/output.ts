namespace N__2 {
    export interface Inferred__3 {
        exported__0: true;
    }
}
namespace N__2 {
    export type Extract__4<T__5> = T__5 extends {
        value__0: infer Inferred;
    } ? Inferred : never;
}
