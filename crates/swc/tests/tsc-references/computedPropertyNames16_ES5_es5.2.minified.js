function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var s, n, a, tmp = s, tmp1 = n, tmp2 = s + s, tmp3 = s + n, tmp4 = +s, tmp5 = a, tmp6 = "hello ".concat(a, " bye"), C = function() {
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
            get: function() {
                return 0;
            }
        },
        {
            key: tmp1,
            set: function(v) {
            }
        },
        {
            key: tmp3,
            set: function(v) {
            }
        },
        {
            key: tmp4,
            get: function() {
                return 0;
            }
        },
        {
            key: 0,
            get: function() {
                return 0;
            }
        },
        {
            key: tmp5,
            set: function(v) {
            }
        },
        {
            key: "hello bye",
            set: function(v) {
            }
        },
        {
            key: tmp6,
            get: function() {
                return 0;
            }
        }
    ], staticProps = [
        {
            key: tmp2,
            get: function() {
                return 0;
            }
        },
        {
            key: "",
            set: function(v) {
            }
        },
        {
            key: !0,
            get: function() {
                return 0;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
