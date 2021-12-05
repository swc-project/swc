// @declaration: true
function foo(f1) {
    return f1;
}
var f = foo(function(y) {
    return y === "foo" ? y : "foo";
});
var fResult = f("foo");
