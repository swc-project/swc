function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
var x, a1, a2, a3, a4, b1, b2, b3, b4, o1, o2, o3, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    }
    return protoProps = [
        {
            key: "foo",
            value: function() {
            }
        }
    ], _defineProperties((Constructor = C).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
_instanceof(a1, x), _instanceof(a2, x), _instanceof(a3, x), _instanceof(a4, x), _instanceof(0, x), _instanceof(!0, x), _instanceof("", x), _instanceof(null, x), _instanceof(void 0, x), _instanceof(x, b1), _instanceof(x, b2), _instanceof(x, b3), _instanceof(x, b4), _instanceof(x, 0), _instanceof(x, !0), _instanceof(x, ""), _instanceof(x, o1), _instanceof(x, o2), _instanceof(x, o3), _instanceof("", {
});
