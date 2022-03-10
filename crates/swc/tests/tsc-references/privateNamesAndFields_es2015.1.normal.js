import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _foo, 3);
    }
}
var _foo1 = /*#__PURE__*/ new WeakMap();
class B extends A {
    constructor(){
        super();
        swcHelpers.classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _foo1, "some string");
    }
}
