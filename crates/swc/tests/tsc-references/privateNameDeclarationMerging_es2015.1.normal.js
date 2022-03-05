import * as swcHelpers from "@swc/helpers";
// @target: es6
class D {
}
var _x = new WeakMap();
class C {
    foo() {
        const c = new C();
        swcHelpers.classPrivateFieldGet(c, _x); // OK
        const d = new C();
        swcHelpers.classPrivateFieldGet(d, _x); // Error
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
