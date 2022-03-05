import * as swcHelpers from "@swc/helpers";
var _field = new WeakMap(), _uninitialized = new WeakMap();
// @target: es2015
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _field, {
            writable: true,
            value: 10
        });
        swcHelpers.classPrivateFieldInit(this, _uninitialized, {
            writable: true,
            value: void 0
        });
    }
}
