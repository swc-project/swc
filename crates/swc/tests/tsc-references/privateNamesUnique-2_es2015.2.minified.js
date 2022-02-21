function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
import { Foo as A } from "./a";
import { Foo as B } from "./b";
export class Foo {
    copy(other) {
        !function(receiver, privateMap) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver).value;
        }(other, _x);
    }
    constructor(){
        _classPrivateFieldInit(this, _x, {
            writable: !0,
            value: void 0
        });
    }
}
var _x = new WeakMap();
export class Foo {
    constructor(){
        _classPrivateFieldInit(this, _x1, {
            writable: !0,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
const a = new A(), b = new B();
a.copy(b); // error
