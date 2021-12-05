var M2;
!function(M2) {
    var a;
    a.foo, a.bar;
}(M2 || (M2 = {
})), (function(M2) {
    var a;
    a.foo, a.bar, a.baz;
})(M2 || (M2 = {
})), (function(M21) {
    var a;
    let M3;
    M3 || (M3 = {
    }), a.foo, a.bar, M21.M3 = M3;
})(M2 || (M2 = {
})), (function(M22) {
    var a;
    let M3;
    M3 || (M3 = {
    }), a.foo, a.bar, a.baz, M22.M3 = M3;
})(M2 || (M2 = {
})), (function(M23) {
    var a;
    let M3;
    M3 || (M3 = {
    }), a.foo, a.bar, a.baz, M23.M3 = M3;
})(M2 || (M2 = {
}));
