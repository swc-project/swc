function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _toStringTag = Symbol.toStringTag, C1 = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C1() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C1);
    }
    return Constructor = C1, protoProps = [
        {
            key: _toStringTag,
            value: function() {
                return {
                    x: ""
                };
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C1;
}();
