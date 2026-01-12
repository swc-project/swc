//// [foo1.ts]
export function x() {
    return true;
}
//// [foo2.ts]
var x = foo1.x;
export { };
//// [foo3.ts]
var x = foo2(); // should be boolean
export { };
