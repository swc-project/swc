import * as swcHelpers from "@swc/helpers";
var _x = new WeakMap();
class C {
    foo() {
        let c = new C();
        swcHelpers.classPrivateFieldGet(c, _x);
        let d = new C();
        swcHelpers.classPrivateFieldGet(d, _x);
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
