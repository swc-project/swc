// @declaration: true
function foo(f) {
    return f;
}
let f1 = foo((y)=>y === "foo" ? y : "foo"
);
let fResult = f1("foo");
