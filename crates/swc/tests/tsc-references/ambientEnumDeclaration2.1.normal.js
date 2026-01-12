//// [ambientEnumDeclaration2.ts]
// In ambient enum declarations that specify no const modifier, enum member declarations
// that omit a value are considered computed members (as opposed to having auto- incremented values assigned).
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    return E;
}(E || {});
