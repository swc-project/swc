export var Clazz = function() {
    "use strict";
    var Constructor;
    function Clazz() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Clazz);
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = Clazz, [
        {
            key: "method",
            value: function() {}
        }
    ]), Clazz;
}();
Clazz.method.prop = 5;
