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
var _method = new WeakSet();
var A1 = function A1(name) {
    "use strict";
    _classCallCheck(this, A1);
    _method.add(this);
    _classPrivateMethodGet(this, _method, method).call(this, "");
    _classPrivateMethodGet(this, _method, method).call(this, 1) // Error
    ;
    _classPrivateMethodGet(this, _method, method).call(this) // Error 
    ;
};
function method(param) {
    return "";
}
