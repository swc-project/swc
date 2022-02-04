// @declaration: true
function foo(f1) {
    return f1;
}
function bar(f2) {
    return f2;
}
var f = foo(function(x) {
    return x;
});
var fResult = f("foo");
var g = foo(function(x) {
    return x;
});
var gResult = g("foo");
var h = bar(function(x) {
    return x;
});
var hResult = h("foo");
hResult = h("bar");
