var M2;
!function(M2) {
    var a;
    a.foo, a.bar;
}(M2 || (M2 = {})), function(M2) {
    var a;
    a.foo, a.bar;
}(M2 || (M2 = {})), function(M21) {
    var a;
    M21.M3 || (M21.M3 = {}), a.foo, a.bar;
}(M2 || (M2 = {})), function(M22) {
    var a;
    M22.M3 || (M22.M3 = {}), a.foo, a.bar;
}(M2 || (M2 = {}));
