//// [invalidUndefinedValues.ts]
var M, E;
(M || (M = {})).x = 1, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A;
