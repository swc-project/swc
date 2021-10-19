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
    constructor(name){
        _name.set(this, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldSet(this, _name, name);
    }
}
var _name = new WeakMap();
