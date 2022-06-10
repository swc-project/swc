// @declaration: true
function foo(f1) {
    return f1;
}
function bar(f2) {
    return f2;
}
let f = foo((x)=>x);
let fResult = f("foo");
let g = foo((x)=>x);
let gResult = g("foo");
let h = bar((x)=>x);
let hResult = h("foo");
hResult = h("bar");
