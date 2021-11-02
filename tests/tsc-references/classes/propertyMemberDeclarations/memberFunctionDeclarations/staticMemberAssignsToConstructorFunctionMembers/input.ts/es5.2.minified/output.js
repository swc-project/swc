var C = function() {
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
                C.foo = function() {
                };
            }
        },
        {
            key: "bar",
            value: function(x1) {
                return C.bar = function() {
                }, C.bar = function(x) {
                    return x;
                }, C.bar = function(x) {
                    return 1;
                }, 1;
            }
        }
    ]), C;
}();
