import * as swcHelpers from "@swc/helpers";
var _p1 = new WeakMap();
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
class Foo {
    m1(v) {
        swcHelpers.classPrivateFieldGet(this, _p1).call(this, v);
        v;
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _p1, {
            writable: true,
            value: (v)=>{
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
}
var _p11 = new WeakSet();
class Foo2 {
    m1(v) {
        swcHelpers.classPrivateMethodGet(this, _p11, p1).call(this, v);
        v;
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _p11);
    }
}
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
