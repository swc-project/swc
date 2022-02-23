"use strict";
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
class Foo {
    get connected() {
        return _classPrivateFieldGet(this, _ws2) && _classPrivateFieldGet(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _classPrivateFieldInit(this, _ws, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInit(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
var _ws = new WeakMap();
var _ws2 = new WeakMap();
