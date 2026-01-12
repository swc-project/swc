//// [foo1.ts]
export function x() {
    return !0;
}
//// [foo2.ts]
foo1.x;
export { };
//// [foo3.ts]
foo2();
export { };
