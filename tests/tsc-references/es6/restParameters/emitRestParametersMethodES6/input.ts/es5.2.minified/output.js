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
var C = function() {
    "use strict";
    function C(name) {
        for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "bar",
            value: function() {
                for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
            }
        },
        {
            key: "foo",
            value: function(x) {
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
            }
        }
    ]), C;
}(), D = function() {
    "use strict";
    function D() {
        for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
        _classCallCheck(this, D);
    }
    return _createClass(D, [
        {
            key: "bar",
            value: function() {
                for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
            }
        },
        {
            key: "foo",
            value: function(x) {
                for(var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)rest[_key - 1] = arguments[_key];
            }
        }
    ]), D;
}();
