function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
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
// @strict: true
// @target: es6
class A1 {
    constructor(name){
        _classPrivateMethodInit(this, _method);
        _classPrivateMethodGet(this, _method, method).call(this, "");
        _classPrivateMethodGet(this, _method, method).call(this, 1) // Error
        ;
        _classPrivateMethodGet(this, _method, method).call(this) // Error 
        ;
    }
}
function method(param) {
    return "";
}
