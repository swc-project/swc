// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
// @target: es2015
// @filename: a.ts
export class Foo {
    copy(other) {
        _classPrivateFieldGet(other, _x); // error
    }
    constructor(){
        _x.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
// @filename: b.ts
export class Foo {
    constructor(){
        _x1.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
const a = new A();
const b = new B();
a.copy(b); // error
