var M2;
!function(M2) {
    var a;
    a.foo, a.bar;
}(M2 || (M2 = {})), function(M2) {
    var a;
    a.foo, a.bar, a.baz;
}(M2 || (M2 = {})), function(M2) {
    var a;
    M2.M3 || (M2.M3 = {}), a.foo, a.bar;
}(M2 || (M2 = {})), function(M2) {
    var a;
    M2.M3 || (M2.M3 = {}), a.foo, a.bar, a.baz;
}(M2 || (M2 = {})), function(M2) {
    var a;
    M2.M3 || (M2.M3 = {}), a.foo, a.bar, a.baz;
}(M2 || (M2 = {}));
