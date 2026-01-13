//// [importStatementsInterfaces.ts]
(function(B) {
    var a = A;
})(B || (B = {}));
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
})(C || (C = {}));
(function(D) {
    var a = A;
    var p;
})(D || (D = {}));
(function(E) {
    var a = A.inA;
    function xDist(x) {
        return 0 - x.x;
    }
    E.xDist = xDist;
})(E || (E = {}));
var B, C, D, E;
