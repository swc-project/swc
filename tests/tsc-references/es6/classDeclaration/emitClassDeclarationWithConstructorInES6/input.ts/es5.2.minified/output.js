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
var A = function() {
    "use strict";
    function A(x) {
        _classCallCheck(this, A);
    }
    return _createClass(A, [
        {
            key: "foo",
            value: function() {
            }
        }
    ]), A;
}(), B = function() {
    "use strict";
    function B(x, param) {
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++)args[_key - 2] = arguments[_key];
        _classCallCheck(this, B), this.x = "hello", this.y = 10;
    }
    return _createClass(B, [
        {
            key: "baz",
            value: function(z, v) {
                return this._bar;
            }
        }
    ]), B;
}();
