function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
var _key, A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _classPrivateFieldInit(this, _foo, {
        writable: !0,
        value: _classPrivateFieldGet(this, _bar)
    }), _classPrivateFieldInit(this, _bar, {
        writable: !0,
        value: _classPrivateFieldGet(this, _foo)
    }), this[_key] = this["#baz"];
}, _foo = new WeakMap(), _bar = new WeakMap();
_key = "#baz";
