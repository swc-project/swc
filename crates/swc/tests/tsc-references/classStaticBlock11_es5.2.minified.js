var C = function(x) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), _x.set(this, {
        writable: !0,
        value: 1
    }), (function(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
        var descriptor = privateMap.get(receiver);
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        descriptor.value = value;
    })(this, _x, x);
}, _x = new WeakMap();
