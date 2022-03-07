import * as swcHelpers from "@swc/helpers";
var _x, C = (_x = new WeakMap(), function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class), swcHelpers.classPrivateFieldInit(this, _x, {
            get: void 0,
            set: set_x
        });
    }
    return _class.prototype.m = function() {
        swcHelpers.classPrivateFieldSet(this, _x, swcHelpers.classPrivateFieldGet(this, _x) + 2);
    }, _class;
}());
function set_x(x) {}
console.log(new C().m());
