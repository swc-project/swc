import * as swcHelpers from "@swc/helpers";
var _name = new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(name){
        swcHelpers.classPrivateFieldInit(this, _name, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _name, name);
    }
}
