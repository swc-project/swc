module A {
    const a = 1;
    const b = 2;
    export const { a: A } = { a };
    export const { b: B } = { b };
}
namespace A {
    const c = 3;
    const d = 4;
    export const { c: C } = { c: c };
    export const { d: D } = { d: d };
}
