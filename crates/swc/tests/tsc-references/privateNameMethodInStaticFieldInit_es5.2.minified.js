var _method = new WeakSet(), C = function() {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), obj = this, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateSet = _method), privateSet.add(obj);
};
C.s = new C().#method(), console.log(C.s);
