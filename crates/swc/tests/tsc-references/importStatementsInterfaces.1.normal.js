//// [importStatementsInterfaces.ts]
// no code gen expected
(function(C) {
    var m;
    var p;
    var p = {
        x: 0,
        y: 0,
        z: 0
    };
})(C || (C = {}));
// no code gen expected
(function(D) {
    var p;
})(D || (D = {}));
// no code gen expected
(function(E) {
    function xDist(x) {
        return 0 - x.x;
    }
    E.xDist = xDist;
})(E || (E = {}));
var C, D, E;
