// @declaration: true
function foo(f) {
    return f;
}
function bar(f) {
    return f;
}
let f1 = foo((x)=>x
);
let fResult = f1("foo");
let g = foo((x)=>x
);
let gResult = g("foo");
let h = bar((x)=>x
);
let hResult = h("foo");
hResult = h("bar");
