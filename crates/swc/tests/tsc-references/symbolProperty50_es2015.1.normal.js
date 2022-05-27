//@target: ES6
var M;
(function(M) {
    class C {
        [Symbol.iterator]() {}
    }
})(M || (M = {}));
