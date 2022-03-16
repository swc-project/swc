import * as swcHelpers from "@swc/helpers";
var _prop = /*#__PURE__*/ new WeakMap(), _roProp = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
class A1 {
    constructor(name){
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
    }
}
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
