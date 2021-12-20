//@target: ES6
var M;
(function(M) {
    var Symbol;
    var tmp = Symbol.iterator;
    class C {
        [tmp]() {
        }
    }
})(M || (M = {
}));
