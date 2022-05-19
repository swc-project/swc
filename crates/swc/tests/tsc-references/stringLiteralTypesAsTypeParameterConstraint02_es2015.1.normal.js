// @declaration: true
function foo(f1) {
    return f1;
}
let f = foo((y)=>y === "foo" ? y : "foo");
let fResult = f("foo");
