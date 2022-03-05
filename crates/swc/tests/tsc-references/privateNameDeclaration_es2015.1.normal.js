import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _bar = new WeakMap();
// @declaration: true
// @target: es2015
class A {
    quux() {}
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _bar, {
            writable: true,
            value: 6
        });
        this.qux = 6;
    }
}
