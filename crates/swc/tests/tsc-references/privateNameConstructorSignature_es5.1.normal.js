import * as swcHelpers from "@swc/helpers";
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
    C.test = function test() {
        swcHelpers.classPrivateFieldSet(new C(), _x, 10);
        var y = new C();
        var z = new y();
        z.x = 123;
    };
    return C;
}();
