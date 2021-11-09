function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var M, cls = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function cls() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, cls);
    }
    return protoProps = [
        {
            key: "f",
            value: function() {
            }
        },
        {
            key: "g",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = cls).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), cls;
}();
(M || (M = {
})).fn2 = function() {
};
