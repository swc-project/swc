//// [twoMergedInterfacesWithDifferingOverloads2.ts]
var a, G, r = a(), r2 = a(1), r3 = a(1, 2);
!function(G) {
    var a;
    a(), a(!0), a(!0, 2), a(1, !0);
}(G || (G = {}));
