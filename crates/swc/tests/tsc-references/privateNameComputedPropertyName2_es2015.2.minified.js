import * as swcHelpers from "@swc/helpers";
let getX;
var _x = new WeakMap();
let tmp = (getX = (a)=>swcHelpers.classPrivateFieldGet(a, _x), "_");
console.log(getX(new class {
    [tmp]() {}
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: !0,
            value: 100
        });
    }
}));
