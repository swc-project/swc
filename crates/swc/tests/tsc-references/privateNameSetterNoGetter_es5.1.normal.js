import * as swcHelpers from "@swc/helpers";
var _x, _class;
// @target: es2015
var C = (_x = /*#__PURE__*/ new WeakMap(), _class = /*#__PURE__*/ function() {
    "use strict";
    function _class1() {
        swcHelpers.classCallCheck(this, _class1);
        swcHelpers.classPrivateFieldInit(this, _x, {
            get: void 0,
            set: set_x
        });
    }
    var _proto = _class1.prototype;
    _proto.m = function m() {
        swcHelpers.classPrivateFieldSet(this, _x, swcHelpers.classPrivateFieldGet(this, _x) + 2); // Error
    };
    return _class1;
}(), _class);
console.log(new C().m());
function set_x(x) {}
