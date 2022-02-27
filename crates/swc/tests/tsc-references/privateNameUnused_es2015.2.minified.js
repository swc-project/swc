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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _used = new WeakMap(), _unused = new WeakMap();
export class A {
    constructor(){
        _classPrivateFieldInit(this, _used, {
            writable: !0,
            value: "used"
        }), _classPrivateFieldInit(this, _unused, {
            writable: !0,
            value: "unused"
        }), console.log(_classPrivateFieldGet(this, _used));
    }
}
var _used1 = new WeakSet(), _unused1 = new WeakSet();
export class A2 {
    constructor(){
        _classPrivateMethodInit(this, _used1), _classPrivateMethodInit(this, _unused1), console.log((function(receiver, privateSet, fn) {
            if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
            return fn;
        })(this, _used1, function() {}).call(this));
    }
}
var _used2 = new WeakMap(), _unused2 = new WeakMap();
export class A3 {
    constructor(){
        _classPrivateFieldInit(this, _used2, {
            get: function() {
                return 0;
            },
            set: function(value) {}
        }), _classPrivateFieldInit(this, _unused2, {
            get: function() {
                return 0;
            },
            set: function(value) {}
        }), console.log(_classPrivateFieldGet(this, _used2));
    }
}
