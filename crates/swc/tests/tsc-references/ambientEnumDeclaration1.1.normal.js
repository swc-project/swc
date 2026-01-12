//// [ambientEnumDeclaration1.ts]
// In ambient enum declarations, all values specified in enum member declarations must be classified as constant enum expressions.
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 10] = "a";
    E[E["b"] = 11] = "b";
    E[E["c"] = 11] = "c";
    E[E["d"] = 12] = "d";
    E[E["e"] = 655360] = "e";
    return E;
}(E || {});
