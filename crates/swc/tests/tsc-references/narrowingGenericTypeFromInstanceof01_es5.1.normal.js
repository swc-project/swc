import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var A = function A(a) {
    "use strict";
    _class_call_check(this, A);
    this.a = a;
};
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
function acceptA(a) {}
function acceptB(b) {}
function test(x) {
    if (_instanceof(x, B)) {
        acceptA(x);
    }
    if (_instanceof(x, A)) {
        acceptA(x);
    }
    if (_instanceof(x, B)) {
        acceptB(x);
    }
    if (_instanceof(x, B)) {
        acceptB(x);
    }
}
