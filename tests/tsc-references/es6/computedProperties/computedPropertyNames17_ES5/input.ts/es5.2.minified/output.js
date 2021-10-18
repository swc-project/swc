function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var tmp = void 0, tmp1 = [], tmp2 = {
}, tmp3 = void 0, C = function() {
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
            get: function() {
                return 0;
            }
        },
        {
            key: tmp2,
            set: function(v) {
            }
        },
        {
            key: null,
            set: function(v) {
            }
        }
    ], staticProps = [
        {
            key: !0,
            set: function(v) {
            }
        },
        {
            key: tmp3,
            get: function() {
                return 0;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
