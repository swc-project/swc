// no code gen expected
var B;
(function(B) {
    var a = A;
})(B || (B = {
}));
// no code gen expected
var C;
(function(C) {
    var a = A;
    var b = a.inA;
    var m;
    var p;
    var p = {
        x: 0,
        y: 0,
        z: 0
    };
})(C || (C = {
}));
// no code gen expected
var D;
(function(D) {
    var a = A;
    var p;
})(D || (D = {
}));
// no code gen expected
var E1;
(function(E) {
    var a = A.inA;
    function xDist(x) {
        return 0 - x.x;
    }
    E.xDist = xDist;
})(E1 || (E1 = {
}));
