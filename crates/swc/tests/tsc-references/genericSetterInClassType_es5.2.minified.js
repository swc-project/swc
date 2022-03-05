var Generic;
import * as swcHelpers from "@swc/helpers";
!function(Generic) {
    var C = function() {
        "use strict";
        function C() {
            swcHelpers.classCallCheck(this, C);
        }
        return swcHelpers.createClass(C, [
            {
                key: "y",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }(), c = new C();
    c.y = c.y;
    var _value = new WeakMap(), Box = function() {
        "use strict";
        function Box() {
            swcHelpers.classCallCheck(this, Box), swcHelpers.classPrivateFieldInit(this, _value, {
                writable: !0,
                value: void 0
            });
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
    new Box().value = 3;
}(Generic || (Generic = {}));
