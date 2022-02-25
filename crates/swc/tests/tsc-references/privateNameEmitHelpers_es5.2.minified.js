function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _a = new WeakMap(), _b = new WeakSet(), _c = new WeakMap();
export var C = function() {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), _classPrivateFieldInit(this, _a, {
        writable: !0,
        value: 1
    }), obj = this, _checkPrivateRedeclaration(obj, privateSet = _b), privateSet.add(obj), _classPrivateFieldInit(this, _c, {
        get: void 0,
        set: set_c
    });
};
function set_c(v) {
    var receiver, privateMap, descriptor, receiver, descriptor, receiver, privateMap, value, descriptor;
    receiver = this, privateMap = _a, receiver = this, value = ((descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _a, "get")).get ? descriptor.get.call(receiver) : descriptor.value) + v, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    })(receiver, descriptor, value);
}
