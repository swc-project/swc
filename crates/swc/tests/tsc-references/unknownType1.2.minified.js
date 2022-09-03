//// [unknownType1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
function f10(x) {
    x.foo, x[10], x();
}
function f11(x) {
    x.foo, x[5], x(), new x();
}
function f20(x) {
    _instanceof(x, Error), isFunction(x);
}
function f21(pAny, pNever, pT) {
    Error();
}
function f22(x) {}
function f23(x) {}
function f24(x) {}
function f25() {}
function f26(x, y, z) {
    _object_spread({
        a: 42
    }, x), _object_spread({
        a: 42
    }, x, y), _object_spread({
        a: 42
    }, x, y, z), _object_spread({
        a: 42
    }, z);
}
function f27() {}
function f28(x) {
    _extends({}, x);
}
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
function f30(t, u) {}
function oops(arg) {
    return arg;
}
