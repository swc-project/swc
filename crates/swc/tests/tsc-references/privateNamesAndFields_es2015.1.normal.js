function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
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
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
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
var _foo = new WeakMap();
// @strict: true
// @target: es6
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _foo, 3);
    }
}
var _foo1 = new WeakMap();
class B extends A {
    constructor(){
        super();
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _foo1, "some string");
    }
}
