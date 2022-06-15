// @declaration: true
function foo(f) {
    return f;
}
function bar(f) {
    return f;
}
let f = foo((x)=>x);
let fResult = f("foo");
let g = foo((x)=>x);
let gResult = g("foo");
let h = bar((x)=>x);
let hResult = h("foo");
hResult = h("bar");
