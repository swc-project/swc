//@target: ES5
var M;
(function(M1) {
    var Symbol;
    class C {
        [Symbol.iterator]() {}
    }
    M1.C = C;
    (new C)[Symbol.iterator];
})(M || (M = {}));
(new M.C)[Symbol.iterator];
