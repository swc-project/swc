function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
var _fooField = new WeakMap(), _fooMethod = new WeakSet(), _fooProp = new WeakMap(), A = function() {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _classPrivateFieldInit(this, _fooField, {
        writable: !0,
        value: 3
    }), obj = this, _checkPrivateRedeclaration(obj, privateSet = _fooMethod), privateSet.add(obj), _classPrivateFieldInit(this, _fooProp, {
        get: function() {
            return 1;
        },
        set: set_fooProp
    }), this.bar = 3, this.baz = 3;
};
function set_fooProp(value) {}
