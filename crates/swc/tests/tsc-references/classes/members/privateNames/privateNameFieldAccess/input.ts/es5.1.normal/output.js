function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _myField.set(this, {
        writable: true,
        value: "hello world"
    });
    console.log(_classPrivateFieldGet(this, _myField));
};
var _myField = new WeakMap();
