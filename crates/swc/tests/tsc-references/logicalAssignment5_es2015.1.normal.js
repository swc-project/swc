// @strict: true
// @target: esnext, es2021, es2020, es2015
function foo1(f) {
    f !== null && f !== void 0 ? f : f = (a)=>a;
    f(42);
}
function foo2(f) {
    f || (f = (a)=>a);
    f(42);
}
function foo3(f) {
    f && (f = (a)=>a);
    f(42);
}
function bar1(f) {
    f !== null && f !== void 0 ? f : f = (f.toString(), (a)=>a);
    f(42);
}
function bar2(f) {
    f || (f = (f.toString(), (a)=>a));
    f(42);
}
function bar3(f) {
    f && (f = (f.toString(), (a)=>a));
    f(42);
}
