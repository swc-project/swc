function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _method = new WeakSet(), _acc = new WeakSet(), _acc = new WeakSet(), A = function() {
    "use strict";
    var obj, privateMap, value;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), obj = this, value = {
        writable: !0,
        value: 123
    }, _checkPrivateRedeclaration(obj, privateMap = _field), privateMap.set(obj, value), _classPrivateMethodInit(this, _method), _classPrivateMethodInit(this, _acc), _classPrivateMethodInit(this, _acc);
}, _field = new WeakMap();
