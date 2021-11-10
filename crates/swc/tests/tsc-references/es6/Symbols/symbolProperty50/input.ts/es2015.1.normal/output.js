//@target: ES6
var M;
(function(M) {
    var tmp = Symbol.iterator;
    class C {
        [tmp]() {
        }
    }
})(M || (M = {
}));
