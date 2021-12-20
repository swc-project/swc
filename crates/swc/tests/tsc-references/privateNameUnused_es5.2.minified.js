export var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _used.set(this, {
        writable: !0,
        value: "used"
    }), _unused.set(this, {
        writable: !0,
        value: "unused"
    }), console.log(function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    }(this, _used));
};
var _used = new WeakMap(), _unused = new WeakMap();
