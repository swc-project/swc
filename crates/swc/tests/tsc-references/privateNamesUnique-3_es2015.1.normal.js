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
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var _foo = new WeakMap();
// @target: es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 1
        });
    }
}
var _foo = {
    writable: true,
    value: true
} // error (duplicate)
;
class B {
    test(x) {
        _classStaticPrivateFieldSpecGet(x, B, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
var _foo1 = {
    writable: true,
    value: true
};
