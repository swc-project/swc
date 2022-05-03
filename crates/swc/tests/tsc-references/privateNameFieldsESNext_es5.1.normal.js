import * as swcHelpers from "@swc/helpers";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _something = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022
// @useDefineForClassFields: false
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: true,
            value: 10
        });
        swcHelpers.classPrivateFieldInit(this, _b, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _something, {
            writable: true,
            value: function() {
                return 1234;
            }
        });
        this.a = 123;
        this.c = "hello";
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        console.log(swcHelpers.classPrivateFieldGet(this, _a));
        swcHelpers.classPrivateFieldSet(this, _a, "hello");
        console.log(swcHelpers.classPrivateFieldGet(this, _b));
    };
    C.test = function test() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, C, _m));
        console.log(swcHelpers.classStaticPrivateFieldSpecSet(this, C, _x, "test"));
    };
    return C;
}();
var _m = {
    writable: true,
    value: "test"
};
var _x = {
    writable: true,
    value: void 0
};
