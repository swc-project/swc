//// [inferTypes2.ts]
// Repros from #22755
export function bar(obj) {
    return foo(obj);
}
export function bar2(obj) {
    return foo2(obj);
}
