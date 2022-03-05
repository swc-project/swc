import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A1 {
}
var _something = new WeakMap();
class C {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _something, {
            writable: true,
            value: void 0
        });
    }
}
const c = a;
