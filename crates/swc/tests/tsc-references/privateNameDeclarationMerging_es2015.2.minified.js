import * as swcHelpers from "@swc/helpers";
var _x = new WeakMap();
class C {
    foo() {
        const c = new C();
        swcHelpers.classPrivateFieldGet(c, _x);
        const d = new C();
        swcHelpers.classPrivateFieldGet(d, _x);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
