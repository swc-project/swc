function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
// @target: es2015
class A {
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 1
        });
    }
}
var _foo = new WeakMap();
var _foo = {
    writable: true,
    value: true
};
class B {
    test(x) {
        _classStaticPrivateFieldSpecGet(x, B, _foo1); // error (#foo is a static property on B, not an instance property)
    }
}
var _foo1 = {
    writable: true,
    value: true
};
