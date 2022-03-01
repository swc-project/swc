//@target: ES6
var M;
(function(M) {
    let _iterator = Symbol.iterator;
    class C {
        [_iterator]() {}
    }
})(M || (M = {}));
