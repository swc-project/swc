function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
var _aMethod = new WeakSet(), _bMethod = new WeakSet(), _cMethod = new WeakSet(), _aProp = new WeakSet(), _aProp = new WeakSet(), _bProp = new WeakSet(), _bProp = new WeakSet(), _cProp = new WeakSet(), _cProp = new WeakSet(), A = function() {
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
    }), _classPrivateMethodInit(this, _aMethod), _classPrivateMethodInit(this, _bMethod), _classPrivateMethodInit(this, _cMethod), _classPrivateMethodInit(this, _aProp), _classPrivateMethodInit(this, _aProp), _classPrivateMethodInit(this, _bProp), _classPrivateMethodInit(this, _bProp), _classPrivateMethodInit(this, _cProp), _classPrivateMethodInit(this, _cProp);
}, _a = new WeakMap(), _b = new WeakMap(), _c = new WeakMap();
