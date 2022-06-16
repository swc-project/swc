// @declaration: true
function foo(f) {
    return f;
}
let f = foo((y)=>y === "foo" ? y : "foo");
let fResult = f("foo");
