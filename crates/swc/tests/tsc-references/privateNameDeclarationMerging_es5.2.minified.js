import * as swcHelpers from "@swc/helpers";
var D = function() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
}, _x = new WeakMap(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function() {
                var c = new C();
                swcHelpers.classPrivateFieldGet(c, _x);
                var d = new C();
                swcHelpers.classPrivateFieldGet(d, _x);
            }
        }
    ]), C;
}();
