//@target: ES6
var M;
(function(M) {
    var Symbol;
    class C {
        [Symbol.iterator]() {}
    }
})(M || (M = {}));
