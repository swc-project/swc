function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var B = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function B() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, B);
    }
    return protoProps = [
        {
            key: "print",
            value: function() {
                return "I am B";
            }
        }
    ], _defineProperties((Constructor = B).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), B;
}();
!function(x) {
    x.then(function(value) {
        new value.B().print();
    });
}(import("./0"));
