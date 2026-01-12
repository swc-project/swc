//// [twoGenericInterfacesDifferingByTypeParameterName2.ts]
// type parameter names are relevant when choosing whether to merge interface declarations
(function(M) {})(M || (M = {}));
(function(M2) {})(M2 || (M2 = {}));
(function(M2) {})(M2 || (M2 = {}));
(function(M3) {})(M3 || (M3 = {}));
(function(M3) {})(M3 || (M3 = {}));
var M, M2, M2, M3, M3;
