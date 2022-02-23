function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _b = new WeakSet(), _c = new WeakSet();
export var C = function() {
    "use strict";
    var obj, privateMap, value;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), obj = this, value = {
        writable: !0,
        value: 1
    }, _checkPrivateRedeclaration(obj, privateMap = _a), privateMap.set(obj, value), _classPrivateMethodInit(this, _b), _classPrivateMethodInit(this, _c);
};
var _a = new WeakMap();
