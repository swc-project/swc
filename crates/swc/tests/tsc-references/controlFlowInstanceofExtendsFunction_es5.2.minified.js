function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
Function.prototype.now = function() {
    return "now";
};
var X = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function X() {
        _classCallCheck(this, X);
    }
    return staticProps = [
        {
            key: "now",
            value: function() {
                return {};
            }
        }
    ], protoProps = [
        {
            key: "why",
            value: function() {}
        }
    ], _defineProperties((Constructor = X).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), X;
}(), Y = function() {
    "use strict";
    _classCallCheck(this, Y);
};
console.log(X.now()), console.log(Y.now());
export var x = Math.random() > 0.5 ? new X() : 1;
(function(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !!right[Symbol.hasInstance](left) : left instanceof right;
})(x, X) && x.why();
