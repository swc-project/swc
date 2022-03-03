function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
var _prop = new WeakMap(), _roProp = new WeakMap();
var A1 = function A1(name) {
    "use strict";
    _classCallCheck(this, A1);
    _classPrivateFieldInit(this, _prop, {
        get: get_prop,
        set: set_prop
    });
    _classPrivateFieldInit(this, _roProp, {
        get: get_roProp,
        set: void 0
    });
    _classPrivateFieldSet(this, _prop, "");
    _classPrivateFieldSet(this, _roProp, ""); // Error
    console.log(_classPrivateFieldGet(this, _prop));
    console.log(_classPrivateFieldGet(this, _roProp));
};
function get_prop() {
    return "";
}
function set_prop(param) {}
function get_roProp() {
    return "";
}
