//// [stringLiteralTypesAsTypeParameterConstraint02.ts]
function foo(f) {
    return f;
}
var f = foo(function(y) {
    return "foo" === y ? y : "foo";
}), fResult = f("foo");
