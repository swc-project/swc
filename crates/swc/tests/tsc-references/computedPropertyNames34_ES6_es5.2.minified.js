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
    return Constructor = C, protoProps = null, staticProps = [
        {
            key: "bar",
            value: function() {
                return (function(obj, key, value) {
                    key in obj ? Object.defineProperty(obj, key, {
                        value: value,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : obj[key] = value;
                })({}, "", function() {}), 0;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
