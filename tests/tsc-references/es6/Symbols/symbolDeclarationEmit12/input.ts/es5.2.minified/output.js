var M1;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(M) {
    var tmp = Symbol.toPrimitive, tmp1 = Symbol.isConcatSpreadable, tmp2 = Symbol.toPrimitive, tmp3 = Symbol.toPrimitive, C = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function C() {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, C);
        }
        return Constructor = C, protoProps = [
            {
                key: tmp,
                value: function(x) {
                }
            },
            {
                key: tmp1,
                value: function() {
                }
            },
            {
                key: tmp2,
                get: function() {
                }
            },
            {
                key: tmp3,
                set: function(x) {
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
    }();
    M.C = C;
}(M1 || (M1 = {
}));
