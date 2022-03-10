import * as swcHelpers from "@swc/helpers";
// @target: es2015
class B {
}
var _x = /*#__PURE__*/ new WeakMap();
class A extends B {
    constructor(){
        void 0;
        super();
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
