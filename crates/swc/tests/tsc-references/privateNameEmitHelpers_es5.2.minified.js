import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export var C = function() {
    swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateMethodInit(this, _b), swcHelpers.classPrivateFieldInit(this, _c, {
        get: void 0,
        set: set_c
    }), swcHelpers.classPrivateFieldInit(this, _a, {
        writable: !0,
        value: 1
    });
};
function set_c(v) {
    swcHelpers.classPrivateFieldSet(this, _a, swcHelpers.classPrivateFieldGet(this, _a) + v);
}
