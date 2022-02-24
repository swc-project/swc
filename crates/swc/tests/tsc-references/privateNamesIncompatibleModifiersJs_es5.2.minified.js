function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap(), _aMethod = new WeakSet(), _bMethod = new WeakSet(), _cMethod = new WeakSet(), _aProp = new WeakMap(), _bProp = new WeakMap(), _cProp = new WeakMap(), A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _classPrivateFieldInit(this, _a, {
        writable: !0,
        value: 1
    }), _classPrivateFieldInit(this, _b, {
        writable: !0,
        value: 1
    }), _classPrivateFieldInit(this, _c, {
        writable: !0,
        value: 1
    }), _classPrivateMethodInit(this, _aMethod), _classPrivateMethodInit(this, _bMethod), _classPrivateMethodInit(this, _cMethod), _classPrivateFieldInit(this, _aProp, {
        get: function() {
            return 1;
        },
        set: set_aProp
    }), _classPrivateFieldInit(this, _bProp, {
        get: function() {
            return 1;
        },
        set: set_bProp
    }), _classPrivateFieldInit(this, _cProp, {
        get: function() {
            return 1;
        },
        set: set_cProp
    });
};
function set_aProp(value) {}
function set_bProp(value) {}
function set_cProp(value) {}
