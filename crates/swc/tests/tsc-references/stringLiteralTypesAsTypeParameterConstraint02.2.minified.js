//// [stringLiteralTypesAsTypeParameterConstraint02.ts]
(function(f) {
    return f;
})(function(y) {
    return "foo" === y ? y : "foo";
})("foo");
