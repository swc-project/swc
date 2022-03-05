import * as swcHelpers from "@swc/helpers";
var _x = new WeakMap();
class C {
    static test() {
        swcHelpers.classPrivateFieldSet(new C(), _x, 10);
        const y = new C();
        const z = new y();
        z.x = 123;
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
