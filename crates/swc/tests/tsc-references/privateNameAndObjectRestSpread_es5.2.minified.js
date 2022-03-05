import * as swcHelpers from "@swc/helpers";
var _prop = new WeakMap(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _prop, {
            writable: !0,
            value: 1
        });
    }
    return swcHelpers.createClass(C, [
        {
            key: "method",
            value: function(other) {
                var obj = swcHelpers.objectSpread({}, other);
                swcHelpers.classPrivateFieldGet(obj, _prop);
                var rest = swcHelpers.extends({}, other);
                swcHelpers.classPrivateFieldGet(rest, _prop);
                var statics = swcHelpers.objectSpread({}, C);
                swcHelpers.classStaticPrivateFieldSpecGet(statics, C, _propStatic);
                var sRest = swcHelpers.extends({}, C);
                swcHelpers.classStaticPrivateFieldSpecGet(sRest, C, _propStatic);
            }
        }
    ]), C;
}(), _propStatic = {
    writable: !0,
    value: 1
};
