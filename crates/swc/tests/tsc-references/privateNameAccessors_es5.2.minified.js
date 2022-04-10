import * as swcHelpers from "@swc/helpers";
var _prop = new WeakMap(), _roProp = new WeakMap(), A1 = function(name) {
    swcHelpers.classCallCheck(this, A1), swcHelpers.classPrivateFieldInit(this, _prop, {
        get: get_prop,
        set: set_prop
    }), swcHelpers.classPrivateFieldInit(this, _roProp, {
        get: get_roProp,
        set: void 0
    }), swcHelpers.classPrivateFieldSet(this, _prop, ""), swcHelpers.classPrivateFieldSet(this, _roProp, ""), console.log(swcHelpers.classPrivateFieldGet(this, _prop)), console.log(swcHelpers.classPrivateFieldGet(this, _roProp));
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
