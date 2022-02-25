function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
// @filename: main.ts
import { Foo as A } from "./a";
import { Foo as B } from "./b";
var _x = new WeakMap();
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
var _x1 = new WeakMap();
// @filename: b.ts
export class Foo {
    constructor(){
        _classPrivateFieldInit(this, _x1, {
            writable: true,
            value: void 0
        });
    }
}
const a = new A();
const b = new B();
a.copy(b); // error
