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
var _foo = new WeakMap(), _bar = new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: _classPrivateFieldGet(this, _bar)
        });
        _classPrivateFieldInit(this, _bar, {
            writable: true,
            value: _classPrivateFieldGet(this, _foo)
        });
        this["#baz"] = this["#baz"] // Error (should *not* be private name error)
        ;
    }
}
