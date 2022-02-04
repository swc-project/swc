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
        _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
}
var _x = new WeakMap();
export class Foo {
    constructor(){
        _x1.set(this, {
            writable: !0,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
const a = new A(), b = new B();
a.copy(b); // error
