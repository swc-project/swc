import * as swcHelpers from "@swc/helpers";
var _x = new WeakMap(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
    return C.test = function() {
        swcHelpers.classPrivateFieldSet(new C(), _x, 10), new new C()().x = 123;
    }, C;
}();
