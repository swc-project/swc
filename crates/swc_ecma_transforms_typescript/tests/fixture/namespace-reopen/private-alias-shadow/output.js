(function(O) {
    O.o = 1;
})(O || (O = {}));
(function(Outer) {
    Outer.Inner = O;
    (function(Inner) {
        Inner.a = 1;
    })(Inner || (Inner = {}));
    var Inner;
})(Outer || (Outer = {}));
const a = 2;
(function(Outer) {
    (function(Inner) {
        Inner.b = a;
    })(Inner || (Inner = {}));
    var Inner;
})(Outer || (Outer = {}));
var O, Outer;
