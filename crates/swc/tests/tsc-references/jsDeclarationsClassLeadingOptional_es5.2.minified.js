function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var Z = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Z() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Z);
    }
    return Constructor = Z, protoProps = [
        {
            key: "f",
            value: function() {
                var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
                return [
                    x,
                    y
                ];
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Z;
}();
