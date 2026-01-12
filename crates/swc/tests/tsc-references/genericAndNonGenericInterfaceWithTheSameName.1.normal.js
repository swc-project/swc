//// [genericAndNonGenericInterfaceWithTheSameName.ts]
// generic and non-generic interfaces with the same name do not merge
(function(M) {})(M || (M = {}));
(function(M2) {})(M2 || (M2 = {}));
(function(M2) {})(M2 || (M2 = {}));
(function(M3) {})(M3 || (M3 = {}));
(function(M3) {})(M3 || (M3 = {}));
var M, M2, M2, M3, M3;
