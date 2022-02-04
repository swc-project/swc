function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export function foo() {}
export var Aleph = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Aleph(a, b) {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Aleph), this.field = b;
    }
    return protoProps = [
        {
            key: "doIt",
            value: function() {}
        }
    ], _defineProperties((Constructor = Aleph).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Aleph;
}();
export var c = 12;
