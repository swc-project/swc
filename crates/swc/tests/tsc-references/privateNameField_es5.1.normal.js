function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
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
var A = function A(name) {
    "use strict";
    _classCallCheck(this, A);
    _name.set(this, {
        writable: true,
        value: void 0
    });
    _classPrivateFieldSet(this, _name, name);
};
var _name = new WeakMap();
