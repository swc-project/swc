function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var abstract = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function abstract() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, abstract);
    }
    return protoProps = [
        {
            key: "foo",
            value: function() {
                return 1;
            }
        }
    ], _defineProperties((Constructor = abstract).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), abstract;
}();
new abstract;
