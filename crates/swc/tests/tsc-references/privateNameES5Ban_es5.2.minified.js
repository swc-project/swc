import * as swcHelpers from "@swc/helpers";
var _field = new WeakMap(), _method = new WeakSet(), _acc = new WeakMap(), A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A), swcHelpers.classPrivateMethodInit(this, _method), swcHelpers.classPrivateFieldInit(this, _acc, {
        get: get_acc,
        set: set_acc
    }), swcHelpers.classPrivateFieldInit(this, _field, {
        writable: !0,
        value: 123
    });
};
function get_acc() {
    return "";
}
function set_acc(x) {}
