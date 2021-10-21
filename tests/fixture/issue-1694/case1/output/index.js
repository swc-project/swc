function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
var _get = new WeakSet();
var MyClass = function MyClass() {
    "use strict";
    _classCallCheck(this, MyClass);
    _get.add(this);
    _classPrivateMethodGet(this, _get, get).call(this);
};
function get() {
    console.log("Hi from a method with a private identifier called #get");
}
var instance1 = new MyClass();
