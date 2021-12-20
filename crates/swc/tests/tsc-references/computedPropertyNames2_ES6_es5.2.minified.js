function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var methodName = "method", accessorName = "accessor", tmp = methodName, tmp1 = methodName, tmp2 = accessorName, tmp3 = accessorName, tmp4 = accessorName, tmp5 = accessorName, C = function() {
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
            set: function(v) {
            }
        }
    ], staticProps = [
        {
            key: tmp1,
            value: function() {
            }
        },
        {
            key: tmp4,
            get: function() {
            }
        },
        {
            key: tmp5,
            set: function(v) {
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
