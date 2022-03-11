import * as swcHelpers from "@swc/helpers";
var _prop = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateFieldInit(this, _prop, {
            writable: true,
            value: 1
        });
    }
    var _proto = C.prototype;
    _proto.method = function method(other) {
        var obj = swcHelpers.objectSpread({}, other);
        swcHelpers.classPrivateFieldGet(obj, _prop);
        var rest = swcHelpers.extends({}, other);
        swcHelpers.classPrivateFieldGet(rest, _prop);
        var statics = swcHelpers.objectSpread({}, C);
        swcHelpers.classStaticPrivateFieldSpecGet(statics, C, _propStatic);
        var sRest = swcHelpers.extends({}, C);
        swcHelpers.classStaticPrivateFieldSpecGet(sRest, C, _propStatic);
    };
    return C;
}();
var _propStatic = {
    writable: true,
    value: 1
};
