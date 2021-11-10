function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
new (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, _class);
    }
    return protoProps = [
        {
            key: "hi",
            value: function() {
                return "Hi!";
            }
        }
    ], _defineProperties((Constructor = _class).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
}())().hi();
