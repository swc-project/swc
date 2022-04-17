import * as swcHelpers from "@swc/helpers";
var _x = new WeakMap();
class C {
    static test() {
        swcHelpers.classPrivateFieldSet(new C(), _x, 10);
        let y = new C(), z = new y();
        z.x = 123;
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
