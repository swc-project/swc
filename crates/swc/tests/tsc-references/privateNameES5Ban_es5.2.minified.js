function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _field = new WeakMap(), _method = new WeakSet(), _acc = new WeakMap(), A = function() {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), obj = this, _checkPrivateRedeclaration(obj, privateSet = _method), privateSet.add(obj), _classPrivateFieldInit(this, _acc, {
        get: get_acc,
        set: set_acc
    }), _classPrivateFieldInit(this, _field, {
        writable: !0,
        value: 123
    });
};
function get_acc() {
    return "";
}
function set_acc(x) {}
