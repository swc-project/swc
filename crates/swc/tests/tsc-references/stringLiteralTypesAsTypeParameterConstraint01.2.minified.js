//// [stringLiteralTypesAsTypeParameterConstraint01.ts]
function foo(f) {
    return f;
}
function bar(f) {
    return f;
}
var f = foo(function(x) {
    return x;
}), fResult = f("foo"), g = foo(function(x) {
    return x;
}), gResult = g("foo"), h = bar(function(x) {
    return x;
}), hResult = h("foo");
hResult = h("bar");
