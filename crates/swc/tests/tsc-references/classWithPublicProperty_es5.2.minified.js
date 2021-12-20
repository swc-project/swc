function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    return staticProps = [
        {
            key: "f",
            value: function() {
                return "";
            }
        }
    ], protoProps = [
        {
            key: "c",
            value: function() {
                return "";
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
C.g = function() {
    return "";
};
var c = new C();
c.x, c.a, c.b, c.c(), c.d(), C.e, C.f(), C.g();
