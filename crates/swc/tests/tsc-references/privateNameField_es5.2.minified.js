var A = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _name.set(this, {
        writable: !0,
        value: void 0
    }), (function(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
        var descriptor = privateMap.get(receiver);
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        descriptor.value = value;
    })(this, _name, name);
}, _name = new WeakMap();
