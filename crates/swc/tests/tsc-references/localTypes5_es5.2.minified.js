function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function() {
    var X = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function X() {
            _classCallCheck(this, X);
        }
        return Constructor = X, protoProps = [
            {
                key: "m",
                value: function() {
                    var Y;
                    return new (Y = function() {
                        _classCallCheck(this, Y);
                    })();
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), X;
    }();
    return new X().m();
}();
