//@target: ES6
var M1;
(function(M) {
    var Symbol;
    var tmp = Symbol.iterator;
    class C {
        [tmp]() {
        }
    }
    M.Symbol = Symbol;
})(M1 || (M1 = {
}));
