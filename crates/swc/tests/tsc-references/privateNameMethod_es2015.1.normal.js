function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
var _method = new WeakSet();
// @strict: true
// @target: es6
class A1 {
    constructor(name){
        _method.add(this);
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
