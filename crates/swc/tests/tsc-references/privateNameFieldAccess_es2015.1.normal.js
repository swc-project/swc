import * as swcHelpers from "@swc/helpers";
var _myField = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _myField, {
            writable: true,
            value: "hello world"
        });
        console.log(swcHelpers.classPrivateFieldGet(this, _myField));
    }
}
