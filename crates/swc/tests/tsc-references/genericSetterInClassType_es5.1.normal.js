import * as swcHelpers from "@swc/helpers";
// @target: esnext
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
        }
        swcHelpers.createClass(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    var c = new C();
    c.y = c.y;
    var _value = new WeakMap();
    var Box = /*#__PURE__*/ function() {
        "use strict";
        function Box() {
            swcHelpers.classCallCheck(this, Box);
            swcHelpers.classPrivateFieldInit(this, _value, {
                writable: true,
                value: void 0
            });
        }
        swcHelpers.createClass(Box, [
            {
                key: "value",
                get: function get() {
                    return swcHelpers.classPrivateFieldGet(this, _value);
                },
                set: function set(value) {
                    swcHelpers.classPrivateFieldSet(this, _value, value);
                }
            }
        ]);
        return Box;
    }();
    new Box().value = 3;
})(Generic || (Generic = {}));
