function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
import { Foo as A } from "./a";
import { Foo as B } from "./b";
export class Foo {
    copy(other) {
        var receiver, privateMap, descriptor, receiver, descriptor;
        (descriptor = descriptor = (function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver);
        })(receiver = other, privateMap = _x, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
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
