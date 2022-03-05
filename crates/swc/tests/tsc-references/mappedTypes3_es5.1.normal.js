import * as swcHelpers from "@swc/helpers";
var Box = function Box() {
    "use strict";
    swcHelpers.classCallCheck(this, Box);
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
