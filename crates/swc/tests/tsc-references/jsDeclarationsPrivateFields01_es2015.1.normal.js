function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
var _calcHello = new WeakSet(), _screamingHello = new WeakSet(), _screamingHello = new WeakSet();
// @target: esnext
// @allowJS: true
// @declaration: true
// @emitDeclarationOnly: true
// @filename: file.js
export class C {
    getWorld() {
        return _classPrivateFieldGet(this, _world);
    }
    constructor(){
        _hello.set(this, {
            writable: true,
            value: "hello"
        });
        _world.set(this, {
            writable: true,
            value: 100
        });
        _calcHello.add(this);
        _screamingHello.add(this);
        /** @param value {string} */ _screamingHello.add(this);
    }
}
var _hello = new WeakMap();
var _world = new WeakMap();
function calcHello() {
    return _classPrivateFieldGet(this, _hello);
}
function screamingHello() {
    return _classPrivateFieldGet(this, _hello).toUpperCase();
}
function screamingHello(value) {
    throw "NO";
}
