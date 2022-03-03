function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(M11) {
    var s;
    M11.s = s;
}(M1 || (M1 = {}));
var M1, M3, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.n = this.s;
    }
    return protoProps = [
        {
            key: "x",
            value: function() {
                this.n;
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
!function(M3) {
    var M4;
    M4 || (M4 = {});
}(M3 || (M3 = {}));
