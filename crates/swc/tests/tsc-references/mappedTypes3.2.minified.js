//// [mappedTypes3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Box = function Box() {
    "use strict";
    _class_call_check(this, Box);
};
function f1(b) {
    var bb = boxify(b);
    bb.isPerfect.value, bb.weight.value;
}
function f2(bb) {
    var b = unboxify(bb);
    b.isPerfect, b.weight;
}
function f3(bb) {
    unboxify(bb).isPerfect, bb.weight;
}
