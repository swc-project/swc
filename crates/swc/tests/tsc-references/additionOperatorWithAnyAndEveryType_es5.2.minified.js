var E, M, E, C = function() {
    "use strict";
    var Constructor;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = C, [
        {
            key: "foo",
            value: function() {}
        }
    ]), C;
}();
(E = E || (E = {}))[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c", (function(M1) {
    var a;
    M1.a = a;
})(M || (M = {})), new C(), E.a;
