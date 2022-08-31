//// [assignEveryTypeToAny.ts]
var E;
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A, E.A;
