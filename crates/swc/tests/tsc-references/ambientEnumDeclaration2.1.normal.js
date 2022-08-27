//// [ambientEnumDeclaration2.ts]
// In ambient enum declarations that specify no const modifier, enum member declarations
// that omit a value are considered computed members (as opposed to having auto- incremented values assigned).
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E || (E = {}));
var E1;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
})(E1 || (E1 = {}));
