// @strict: true
// @declaration: true
// Repros from #22755
export function bar(obj) {
    return foo(obj);
}
export function bar2(obj) {
    return foo2(obj);
}
const a = null;
const b = a;
