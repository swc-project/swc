// @declaration: true
function foo(f) {
    return f;
}
var f = foo(function(y) {
    return y === "foo" ? y : "foo";
});
var fResult = f("foo");
