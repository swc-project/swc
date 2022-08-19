import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function rec1() {
    return rec2();
}
function rec2() {
    return rec1();
}
function rec3() {
    return rec4();
}
function rec4() {
    return rec3();
}
rec1(), rec2(), rec3(), rec4();
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
new Base(), new Base();
