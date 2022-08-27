//// [stringLiteralTypesAsTypeParameterConstraint01.ts]
(function(f) {
    return f;
})(function(x) {
    return x;
})("foo"), (function(f) {
    return f;
})(function(x) {
    return x;
})("foo");
var h = function(f) {
    return f;
}(function(x) {
    return x;
});
h("foo"), h("bar");
