import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap(), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C), this.a = 123, swcHelpers.classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), this.c = "hello", swcHelpers.classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _something, {
            writable: !0,
            value: function() {
                return 1234;
            }
        });
    }
    return C.prototype.method = function() {
        console.log(swcHelpers.classPrivateFieldGet(this, _a)), swcHelpers.classPrivateFieldSet(this, _a, "hello"), console.log(swcHelpers.classPrivateFieldGet(this, _b));
    }, C.test = function() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, C, _m)), console.log(swcHelpers.classStaticPrivateFieldSpecSet(this, C, _x, "test"));
    }, C;
}(), _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
};
