//// [logicalAssignment5.ts]
function foo1(f) {
    null != f || (f = (a)=>a), f(42);
}
function foo2(f) {
    f || (f = (a)=>a), f(42);
}
function foo3(f) {
    f && (f = (a)=>a), f(42);
}
function bar1(f) {
    null != f || (f = (f.toString(), (a)=>a)), f(42);
}
function bar2(f) {
    f || (f = (f.toString(), (a)=>a)), f(42);
}
function bar3(f) {
    f && (f = (f.toString(), (a)=>a)), f(42);
}
