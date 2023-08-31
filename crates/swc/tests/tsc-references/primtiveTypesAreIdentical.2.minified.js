//// [primtiveTypesAreIdentical.ts]
// primitive types are identical to themselves so these overloads will all cause errors
var E, E1;
(E1 = E || (E = {}))[E1.A = 0] = "A";
