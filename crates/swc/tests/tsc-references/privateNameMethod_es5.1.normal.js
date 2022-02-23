function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
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
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
var _method = new WeakSet();
var A1 = function A1(name) {
    "use strict";
    _classCallCheck(this, A1);
    _classPrivateMethodInit(this, _method);
    _classPrivateMethodGet(this, _method, method).call(this, "");
    _classPrivateMethodGet(this, _method, method).call(this, 1) // Error
    ;
    _classPrivateMethodGet(this, _method, method).call(this) // Error 
    ;
};
function method(param) {
    return "";
}
