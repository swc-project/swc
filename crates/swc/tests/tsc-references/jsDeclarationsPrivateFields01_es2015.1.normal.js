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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
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
        _classPrivateFieldInit(this, _hello, {
            writable: true,
            value: "hello"
        });
        _classPrivateFieldInit(this, _world, {
            writable: true,
            value: 100
        });
        _classPrivateMethodInit(this, _calcHello);
        _classPrivateMethodInit(this, _screamingHello);
        /** @param value {string} */ _classPrivateMethodInit(this, _screamingHello);
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
