function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
var _prop = new WeakMap(), _roProp = new WeakMap(), A1 = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _classPrivateFieldInit(this, _prop, {
        get: get_prop,
        set: set_prop
    }), _classPrivateFieldInit(this, _roProp, {
        get: get_roProp,
        set: void 0
    }), _classPrivateFieldSet(this, _prop, ""), _classPrivateFieldSet(this, _roProp, ""), console.log(_classPrivateFieldGet(this, _prop)), console.log(_classPrivateFieldGet(this, _roProp));
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
