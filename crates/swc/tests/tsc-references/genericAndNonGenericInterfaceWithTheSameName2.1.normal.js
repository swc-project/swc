//// [genericAndNonGenericInterfaceWithTheSameName2.ts]
// generic and non-generic interfaces with the same name do not merge
(function(M) {})(M || (M = {}));
(function(M2) {})(M2 || (M2 = {}));
(function(N) {
    (function(M) {})(M || (M = {}));
    var M;
    (function(M2) {})(M2 || (M2 = {}));
    var M2;
})(N || (N = {}));
var M, M2, N;
