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
var A = // @target: es6
/*#__PURE__*/ function() {
    "use strict";
    function A(x) {
        _classCallCheck(this, A);
    }
    _createClass(A, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function() {
    "use strict";
    function B(x, param) {
        var z = param === void 0 ? "hello" : param;
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            args[_key - 2] = arguments[_key];
        }
        _classCallCheck(this, B);
        this.x = "hello";
        this.y = 10;
    }
    _createClass(B, [
        {
            key: "baz",
            value: function baz(z, v) {
                return this._bar;
            }
        }
    ]);
    return B;
}();
