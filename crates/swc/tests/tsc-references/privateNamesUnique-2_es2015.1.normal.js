function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
// @target: es2015
// @filename: a.ts
export class Foo {
    copy(other) {
        _classPrivateFieldGet(other, _x); // error
    }
    constructor(){
        _classPrivateFieldInit(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
// @filename: b.ts
export class Foo {
    constructor(){
        _classPrivateFieldInit(this, _x1, {
            writable: true,
            value: void 0
        });
    }
}
var _x1 = new WeakMap();
const a = new A();
const b = new B();
a.copy(b); // error
