var _key, A = function(message) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _foo.set(this, {
        writable: !0,
        value: 3
    }), this[_key] = this["#bar"], (function(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
        var descriptor = privateMap.get(receiver);
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        descriptor.value = 3;
    })(this, _f, 3), this["#foo"] = 3;
}, _foo = new WeakMap();
_key = "#bar";
