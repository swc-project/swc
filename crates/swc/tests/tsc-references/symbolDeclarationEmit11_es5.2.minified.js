var _key, tmp = (_key = Symbol.iterator, Symbol.isConcatSpreadable), tmp1 = Symbol.toPrimitive, tmp2 = Symbol.toPrimitive, C = function() {
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
            key: tmp,
            value: function() {
            }
        },
        {
            key: tmp1,
            get: function() {
                return "";
            }
        },
        {
            key: tmp2,
            set: function(x) {
            }
        }
    ]), C;
}();
C[_key] = 0;
