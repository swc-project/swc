import * as swcHelpers from "@swc/helpers";
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
var _x = new WeakMap();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {
                var c = new C();
                swcHelpers.classPrivateFieldGet(c, _x); // OK
                var d = new C();
                swcHelpers.classPrivateFieldGet(d, _x); // Error
            }
        }
    ]);
    return C;
}();
