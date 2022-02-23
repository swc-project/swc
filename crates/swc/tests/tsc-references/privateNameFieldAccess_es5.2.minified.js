var A = function() {
    "use strict";
    var obj, privateMap, value;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), obj = this, value = {
        writable: !0,
        value: "hello world"
    }, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateMap = _myField), privateMap.set(obj, value), console.log(function(receiver, privateMap) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver).value;
    }(this, _myField));
}, _myField = new WeakMap();
