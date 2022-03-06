function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _b = void 0, _undefined = void 0, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: _b,
            get: function() {
                return 0;
            }
        },
        {
            key: [],
            get: function() {
                return 0;
            }
        },
        {
            key: {},
            set: function(v) {}
        },
        {
            key: null,
            set: function(v) {}
        }
    ], staticProps = [
        {
            key: !0,
            set: function(v) {}
        },
        {
            key: _undefined,
            get: function() {
                return 0;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
