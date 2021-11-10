// @declaration: true
function foo(f) {
    return f;
}
function bar(f) {
    return f;
}
var f1 = foo(function(x) {
    return x;
});
var fResult = f1("foo");
var g = foo(function(x) {
    return x;
});
var gResult = g("foo");
var h = bar(function(x) {
    return x;
});
var hResult = h("foo");
hResult = h("bar");
