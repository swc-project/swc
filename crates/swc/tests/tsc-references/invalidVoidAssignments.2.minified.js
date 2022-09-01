//// [invalidVoidAssignments.ts]
var x, M, E;
(M || (M = {})).x = 1, M = x, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), x = E, x = E.A, x = {
    f: function() {}
};
