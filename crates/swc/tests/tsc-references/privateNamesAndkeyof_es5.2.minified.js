function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _fooMethod = new WeakSet(), _fooProp = new WeakSet(), _fooProp = new WeakSet(), A = function() {
    "use strict";
    var obj, privateMap, value;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), obj = this, value = {
        writable: !0,
        value: 3
    }, _checkPrivateRedeclaration(obj, privateMap = _fooField), privateMap.set(obj, value), _classPrivateMethodInit(this, _fooMethod), _classPrivateMethodInit(this, _fooProp), _classPrivateMethodInit(this, _fooProp), this.bar = 3, this.baz = 3;
}, _fooField = new WeakMap();
