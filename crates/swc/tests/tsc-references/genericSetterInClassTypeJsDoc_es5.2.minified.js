import * as swcHelpers from "@swc/helpers";
var _value = new WeakMap(), Box = function() {
    "use strict";
    function Box(initialValue) {
        swcHelpers.classCallCheck(this, Box), swcHelpers.classPrivateFieldInit(this, _value, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldSet(this, _value, initialValue);
    }
    return swcHelpers.createClass(Box, [
        {
            key: "value",
            get: function() {
                return swcHelpers.classPrivateFieldGet(this, _value);
            },
            set: function(value) {
                swcHelpers.classPrivateFieldSet(this, _value, value);
            }
        }
    ]), Box;
}();
new Box(3).value = 3;
