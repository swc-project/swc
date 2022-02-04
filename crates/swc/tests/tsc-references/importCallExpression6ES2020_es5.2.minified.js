function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var specify, B = function() {
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
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
import(bar() ? "./0" : void 0), import(void 0), import(bar() ? "./1" : null), import(null);
