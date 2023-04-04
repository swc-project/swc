//// [mappedTypes3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Box = function Box() {
    "use strict";
    _class_call_check(this, Box);
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
