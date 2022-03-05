import * as swcHelpers from "@swc/helpers";
var _foo = new WeakMap();
// @strict: true
// @target: es6
// @strictPropertyInitialization: false
// same as privateNamesUnique-1, but with an interface
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
    }
}
var _foo1 = new WeakMap();
class B {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: void 0
        });
    }
}
const b = new B();
