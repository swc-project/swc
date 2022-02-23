function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _calcHello = new WeakSet(), _screamingHello = new WeakSet(), _screamingHello = new WeakSet();
export class C {
    getWorld() {
        var receiver, privateMap, receiver, descriptor, descriptor;
        return receiver = this, (descriptor = (function(receiver, privateMap, action) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return privateMap.get(receiver);
        })(receiver, privateMap = _world, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
    }
    constructor(){
        _classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), _classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        }), _classPrivateMethodInit(this, _calcHello), _classPrivateMethodInit(this, _screamingHello), _classPrivateMethodInit(this, _screamingHello);
    }
}
var _hello = new WeakMap(), _world = new WeakMap();
