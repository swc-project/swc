//@target: ES6
var M;
(function(M1) {
    var Symbol;
    let _iterator = Symbol.iterator;
    class C {
        [_iterator]() {}
    }
    M1.Symbol = Symbol;
})(M || (M = {}));
