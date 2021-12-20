function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var MyClass = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function MyClass() {
        var _this = this;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, MyClass), this.m = function(n) {
            return n + 1;
        }, this.p = function(n) {
            return n && _this;
        };
    }
    return protoProps = [
        {
            key: "fn",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = MyClass).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), MyClass;
}();
(function() {
    return 0;
})().toExponential();
