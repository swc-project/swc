function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
var _method = new WeakSet(), A1 = function(name) {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), obj = this, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateSet = _method), privateSet.add(obj), _classPrivateMethodGet(this, _method, method).call(this, ""), _classPrivateMethodGet(this, _method, method).call(this, 1), _classPrivateMethodGet(this, _method, method).call(this);
};
function method(param) {
    return "";
}
