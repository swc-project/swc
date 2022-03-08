import * as swcHelpers from "@swc/helpers";
var _prop = new WeakMap(), _roProp = new WeakMap();
// @strict: true
// @target: es6
var A1 = function A1(name) {
    "use strict";
    swcHelpers.classCallCheck(this, A1);
    swcHelpers.classPrivateFieldInit(this, _prop, {
        get: get_prop,
        set: set_prop
    });
    swcHelpers.classPrivateFieldInit(this, _roProp, {
        get: get_roProp,
        set: void 0
    });
    swcHelpers.classPrivateFieldSet(this, _prop, "");
    swcHelpers.classPrivateFieldSet(this, _roProp, ""); // Error
    console.log(swcHelpers.classPrivateFieldGet(this, _prop));
    console.log(swcHelpers.classPrivateFieldGet(this, _roProp));
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
