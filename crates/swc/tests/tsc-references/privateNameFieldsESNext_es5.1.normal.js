import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap();
var C = // @target: esnext, es2022
// @useDefineForClassFields: false
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.a = 123;
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: true,
            value: 10
        });
        this.c = "hello";
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
