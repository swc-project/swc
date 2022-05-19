import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
let getX;
var _x = /*#__PURE__*/ new WeakMap();
let tmp = (getX = (a)=>swcHelpers.classPrivateFieldGet(a, _x), "_");
class A {
    [tmp]() {}
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: 100
        });
    }
}
console.log(getX(new A));
