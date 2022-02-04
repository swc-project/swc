function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
export var ex, crunch, Crunch = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Crunch(n) {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Crunch), this.n = n;
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
                return this.n;
            }
        }
    ], _defineProperties((Constructor = Crunch).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Crunch;
}();
new (require("./ex")).Crunch(1).n;
