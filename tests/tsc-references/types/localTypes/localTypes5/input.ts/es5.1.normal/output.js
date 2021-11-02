function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function foo() {
    var X = /*#__PURE__*/ function() {
        "use strict";
        function X() {
            _classCallCheck(this, X);
        }
        _createClass(X, [
            {
                key: "m",
                value: function m() {
                    return (function() {
                        var Y = function Y() {
                            _classCallCheck(this, Y);
                        };
                        return new Y();
                    })();
                }
            }
        ]);
        return X;
    }();
    var x = new X();
    return x.m();
}
var x1 = foo();
