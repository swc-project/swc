// @declaration: true
function foo(f) {
    return f;
}
var f1 = foo(function(y) {
    return y === "foo" ? y : "foo";
});
var fResult = f1("foo");
