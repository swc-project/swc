function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
export function foo() {
    return "foo";
}
import("./0"), import("./0").then(function(zero) {
    return zero.foo();
});
export var p1, p2 = import("./0");
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "method",
            value: function() {
                import("./0");
            }
        }
    ]), C;
}();
export var D = function() {
    "use strict";
    function D() {
        _classCallCheck(this, D);
    }
    return _createClass(D, [
        {
            key: "method",
            value: function() {
                import("./0");
            }
        }
    ]), D;
}();
