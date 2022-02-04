function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
// @strict: true
// @target: es6
class A {
    constructor(){
        _foo.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _foo, 3);
    }
}
var _foo = new WeakMap();
class B extends A {
    constructor(){
        super();
        _foo1.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _foo1, "some string");
    }
}
var _foo1 = new WeakMap();
