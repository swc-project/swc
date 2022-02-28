function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export class C {
    getWorld() {
        return _classPrivateFieldGet(this, _world);
    }
    constructor(){
        !function(obj, privateSet) {
            _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
        }(this, _calcHello), _classPrivateFieldInit(this, _screamingHello, {
            get: function() {
                return _classPrivateFieldGet(this, _hello).toUpperCase();
            },
            set: function(value) {
                throw "NO";
            }
        }), _classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), _classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        });
    }
}
