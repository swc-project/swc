function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
var _method = new WeakSet(), A1 = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _method.add(this), _classPrivateMethodGet(this, _method, method).call(this, ""), _classPrivateMethodGet(this, _method, method).call(this, 1), _classPrivateMethodGet(this, _method, method).call(this);
};
function method(param) {
    return "";
}
