//// [computedPropertyNames48_ES6.ts]
var E = /*#__PURE__*/ function(E) {
    E[E["x"] = 0] = "x";
    return E;
}(E || {});
var a;
extractIndexer({
    [a]: ""
}); // Should return string
extractIndexer({
    [0]: ""
}); // Should return string
extractIndexer({
    ["" || 0]: ""
}); // Should return any (widened form of undefined)
