import * as swcHelpers from "@swc/helpers";
// @target: es2015
let friendA;
var _x = new WeakMap();
class A {
    getX() {
        return swcHelpers.classPrivateFieldGet(this, _x);
    }
    constructor(v){
        swcHelpers.classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
        swcHelpers.classPrivateFieldSet(this, _x, v);
    }
}
var __ = {
    writable: true,
    value: (()=>{
        friendA = {
            getX (obj) {
                return swcHelpers.classPrivateFieldGet(obj, _x);
            },
            setX (obj, value) {
                swcHelpers.classPrivateFieldSet(obj, _x, value);
            }
        };
    })()
};
class B {
    constructor(a1){
        const x = friendA.getX(a1); // ok
        friendA.setX(a1, x + 1); // ok
    }
}
const a = new A(41);
const b = new B(a);
a.getX();
