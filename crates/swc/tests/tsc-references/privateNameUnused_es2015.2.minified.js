function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
export class A {
    constructor(){
        _classPrivateFieldInit(this, _used, {
            writable: !0,
            value: "used"
        }), _classPrivateFieldInit(this, _unused, {
            writable: !0,
            value: "unused"
        }), console.log(function(receiver, privateMap) {
            var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
                if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                return privateMap.get(receiver);
            }(receiver, privateMap, "get");
            return (descriptor = descriptor).get ? descriptor.get.call(receiver) : descriptor.value;
        }(this, _used));
    }
}
var _used = new WeakMap(), _unused = new WeakMap(), _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        _classPrivateMethodInit(this, _used1), _classPrivateMethodInit(this, _unused1), console.log(_classPrivateMethodGet(this, _used1, function() {}).call(this));
    }
}
var _used2 = new WeakSet(), _used2 = new WeakSet(), _unused2 = new WeakSet(), _unused2 = new WeakSet();
export class A3 {
    constructor(){
        _classPrivateMethodInit(this, _used2), _classPrivateMethodInit(this, _used2), _classPrivateMethodInit(this, _unused2), _classPrivateMethodInit(this, _unused2), console.log(_classPrivateMethodGet(this, _used2, used));
    }
}
function used() {
    return 0;
}
function used(value) {}
