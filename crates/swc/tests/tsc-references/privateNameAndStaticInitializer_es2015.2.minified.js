import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap(), _prop = new WeakMap();
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: !0,
            value: 1
        }), swcHelpers.classPrivateFieldInit(this, _prop, {
            writable: !0,
            value: 2
        });
    }
}
A.inst = new A();
