//// [invalidVoidValues.ts]
var E, M;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A, (M || (M = {})).x = 1;
