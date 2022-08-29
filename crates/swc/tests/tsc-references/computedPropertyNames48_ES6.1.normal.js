//// [computedPropertyNames48_ES6.ts]
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {}));
var a;
extractIndexer({
    [a]: ""
}); // Should return string
extractIndexer({
    [E.x]: ""
}); // Should return string
extractIndexer({
    ["" || 0]: ""
}); // Should return any (widened form of undefined)
