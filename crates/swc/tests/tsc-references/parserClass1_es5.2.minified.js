function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var NullLogger = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function NullLogger() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, NullLogger);
    }
    return Constructor = NullLogger, protoProps = [
        {
            key: "information",
            value: function() {
                return !1;
            }
        },
        {
            key: "debug",
            value: function() {
                return !1;
            }
        },
        {
            key: "warning",
            value: function() {
                return !1;
            }
        },
        {
            key: "error",
            value: function() {
                return !1;
            }
        },
        {
            key: "fatal",
            value: function() {
                return !1;
            }
        },
        {
            key: "log",
            value: function(s) {
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), NullLogger;
}();
