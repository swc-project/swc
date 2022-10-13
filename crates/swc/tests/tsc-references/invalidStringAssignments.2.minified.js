//// [invalidStringAssignments.ts]
var E;
(M = {}).x = 1, M = "", function(E) {
    E[E.A = 0] = "A";
}(E || (E = {}));
