function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, staticProps = [
        {
            key: "foo",
            value: function() {
            }
        },
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ], protoProps = [
        {
            key: "X",
            get: function() {
                return "";
            },
            set: function(v) {
            }
        },
        {
            key: "foo",
            value: function() {
                return "";
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
