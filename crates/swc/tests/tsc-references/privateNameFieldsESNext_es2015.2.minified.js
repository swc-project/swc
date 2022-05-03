import * as swcHelpers from "@swc/helpers";
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap();
class C {
    method() {
        console.log(swcHelpers.classPrivateFieldGet(this, _a)), swcHelpers.classPrivateFieldSet(this, _a, "hello"), console.log(swcHelpers.classPrivateFieldGet(this, _b));
    }
    static test() {
        console.log(swcHelpers.classStaticPrivateFieldSpecGet(this, C, _m)), console.log(swcHelpers.classStaticPrivateFieldSpecSet(this, C, _x, "test"));
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), swcHelpers.classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), swcHelpers.classPrivateFieldInit(this, _something, {
            writable: !0,
            value: ()=>1234
        }), this.a = 123, this.c = "hello";
    }
}
var _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
};
