var _ref, _method = new WeakSet(), C = function() {
    "use strict";
    var obj, privateSet;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), obj = this, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateSet = _method), privateSet.add(obj);
};
C.s = (function(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
})(_ref = new C(), _method, function() {
    return 42;
}).call(_ref), console.log(C.s);
