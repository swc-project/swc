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
(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
var X = function() {
    "use strict";
    function X() {
        _classCallCheck(this, X), this.m = this.m.bind(this), this.mistake = "frankly, complete nonsense";
    }
    return _createClass(X, [
        {
            key: "m",
            value: function() {
            }
        },
        {
            key: "mistake",
            value: function() {
            }
        }
    ]), X;
}(), x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
var Y = function() {
    "use strict";
    function Y() {
        _classCallCheck(this, Y), this.m = this.m.bind(this), this.mistake = "even more nonsense";
    }
    return _createClass(Y, [
        {
            key: "mistake",
            value: function() {
            }
        },
        {
            key: "m",
            value: function() {
            }
        }
    ]), Y;
}();
Y.prototype.mistake = !0;
var y = new Y();
y.m(), y.mistake();
