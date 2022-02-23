function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
var _foo = new WeakMap();
var _bar = {
    writable: true,
    value: 5
};
class Child extends Parent {
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _foo1, {
            writable: true,
            value: "foo"
        });
        _classPrivateFieldInit(this, _bar1, {
            writable: true,
            value: "bar"
        });
    }
}
var _foo1 = new WeakMap();
var _bar1 = new WeakMap();
new Parent().accessChildProps();
