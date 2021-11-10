var E, M1, a1, E1, C = function() {
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
            value: function() {
            }
        }
    ]), C;
}();
(E1 = E || (E = {
}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", E1[E1.c = 2] = "c", (function(M) {
    var a;
    M.a = a;
})(M1 || (M1 = {
})), a1 + a1, E.a + new C(), E.a + C.foo(), E.a + M1;
