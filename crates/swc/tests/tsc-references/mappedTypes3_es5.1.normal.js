function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Box = function Box() {
    "use strict";
    _classCallCheck(this, Box);
};
function f1(b) {
    var bb = boxify(b);
    var isPerfect = bb.isPerfect.value;
    var weight = bb.weight.value;
}
function f2(bb) {
    var b = unboxify(bb); // Infer Bacon for T
    var bool = b.isPerfect;
    var weight = b.weight;
}
function f3(bb) {
    var b = unboxify(bb); // Explicit type parameter required
    var bool = b.isPerfect;
    var weight = bb.weight;
}
