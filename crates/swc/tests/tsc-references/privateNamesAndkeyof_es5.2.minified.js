import * as swcHelpers from "@swc/helpers";
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap(), A = function() {
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateMethodInit(this, _fooMethod), swcHelpers.classPrivateFieldInit(this, _fooProp, {
        get: get_fooProp,
        set: set_fooProp
    }), swcHelpers.classPrivateFieldInit(this, _fooField, {
        writable: !0,
        value: 3
    }), this.bar = 3, this.baz = 3;
};
function get_fooProp() {
    return 1;
}
function set_fooProp(value) {}
