function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Controller = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Controller() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Controller);
    }
    return protoProps = [
        {
            key: "create",
            value: function() {
            }
        },
        {
            key: "delete",
            value: function() {
            }
        },
        {
            key: "var",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = Controller).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Controller;
}();
