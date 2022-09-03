//// [constEnumPropertyAccess1.ts]
!function(G) {
    G[G.A = 1] = "A", G[G.B = 2] = "B", G[G.C = 3] = "C", G[G.D = 2] = "D";
}(G || (G = {}));
var G, o = {
    1: !0
}, a = 1, a1 = 1, g = o[1];
class C {
    1() {}
    get 2() {
        return !0;
    }
    set 2(x) {}
}
