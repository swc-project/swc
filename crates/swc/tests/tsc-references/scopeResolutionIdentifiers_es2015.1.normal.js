// EveryType used in a nested scope of a different EveryType with the same name, type of the identifier is the one defined in the inner scope
var s;
var M1;
(function(M1) {
    var s;
    var n = s;
    var n;
    M1.s = s;
})(M1 || (M1 = {}));
var M2;
(function(M2) {
    var s;
    var n = s;
    var n;
})(M2 || (M2 = {}));
function fn() {
    var s;
    var n = s;
    var n;
}
class C {
    x() {
        var p = this.n;
        var p;
    }
    constructor(){
        this.n = this.s;
    }
}
var M3;
(function(M3) {
    var s;
    let M4;
    (function(M4) {
        var n = s;
        var n;
    })(M4 || (M4 = {}));
})(M3 || (M3 = {}));
