"use strict";
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
class Foo {
    get connected() {
        return _classPrivateFieldGet(this, _ws2) && _classPrivateFieldGet(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _ws.set(this, {
            writable: true,
            value: void 0
        });
        _ws2.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _ws = new WeakMap();
var _ws2 = new WeakMap();
