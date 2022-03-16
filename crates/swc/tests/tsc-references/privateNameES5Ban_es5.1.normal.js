import * as swcHelpers from "@swc/helpers";
var _field = /*#__PURE__*/ new WeakMap(), _method = /*#__PURE__*/ new WeakSet(), _acc = /*#__PURE__*/ new WeakMap();
// @target: es5, es3
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    swcHelpers.classPrivateMethodInit(this, _method);
    swcHelpers.classPrivateFieldInit(this, _acc, {
        get: get_acc,
        set: set_acc
    });
    swcHelpers.classPrivateFieldInit(this, _field, {
        writable: true,
        value: 123
    });
};
var _sAcc = {
    get: get_sAcc,
    set: set_sAcc
};
var _sField = {
    writable: true,
    value: "hello world"
};
function method() {}
function sMethod() {}
function get_acc() {
    return "";
}
function set_acc(x) {}
function get_sAcc() {
    return 0;
}
function set_sAcc(x) {}
