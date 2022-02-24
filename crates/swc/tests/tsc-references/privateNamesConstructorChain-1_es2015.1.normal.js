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
class Parent {
    accessChildProps() {
        var _ref;
        _classPrivateFieldGet(_ref = new Child(), _foo); // OK (`#foo` was added when `Parent`'s constructor was called on `child`)
        _classStaticPrivateFieldSpecGet(Child, Parent, _bar); // Error: not found
    }
    constructor(){
        _classPrivateFieldInit(this, _foo, {
            writable: true,
            value: 3
        });
    }
}
var _bar = {
    writable: true,
    value: 5
};
var _foo1 = new WeakMap(), _bar1 = new WeakMap();
class Child extends Parent {
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: "foo"
        }) // OK (Child's #foo does not conflict, as `Parent`'s `#foo` is not accessible)
        ;
        _classPrivateFieldInit(this, _bar1, {
            writable: true,
            value: "bar"
        }) // OK
        ;
    }
}
