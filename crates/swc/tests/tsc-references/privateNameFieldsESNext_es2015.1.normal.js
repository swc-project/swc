import * as swcHelpers from "@swc/helpers";
var _a = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap(), _something = /*#__PURE__*/ new WeakMap();
// @target: esnext, es2022
// @useDefineForClassFields: false
class C {
    method() {
        console.log(swcHelpers.classPrivateFieldGet(this, _a));
        swcHelpers.classPrivateFieldSet(this, _a, "hello");
        console.log(swcHelpers.classPrivateFieldGet(this, _b));
    }
    static test() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, C, _m));
        console.log(swcHelpers.classStaticPrivateFieldSpecSet(this, C, _x, "test"));
    }
    constructor(){
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
            value: ()=>1234
        });
        this.a = 123;
        this.c = "hello";
    }
}
var _m = {
    writable: true,
    value: "test"
};
var _x = {
    writable: true,
    value: void 0
};
