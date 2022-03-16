import * as swcHelpers from "@swc/helpers";
var _foo = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakMap();
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
