//@target: ES6
var M;
(function(M1) {
    var Symbol;
    var tmp = Symbol.iterator;
    class C {
        [tmp]() {}
    }
    M1.Symbol = Symbol;
})(M || (M = {}));
