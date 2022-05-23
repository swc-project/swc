import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es2015
let getX;
var _x = /*#__PURE__*/ new WeakMap();
class C {
    constructor(x){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: 1
        });
        swcHelpers.classPrivateFieldSet(this, _x, x);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        // getX has privileged access to #x
        getX = (obj)=>swcHelpers.classPrivateFieldGet(obj, _x);
    })()
};
