//// [ambientEnumDeclaration2.ts]
// In ambient enum declarations that specify no const modifier, enum member declarations
// that omit a value are considered computed members (as opposed to having auto- incremented values assigned).
var E, E1, E2, E11;
(E2 = E || (E = {}))[E2.a = 0] = "a", E2[E2.b = 1] = "b", (E11 = E1 || (E1 = {}))[E11.a = 0] = "a", E11[E11.b = 1] = "b";
