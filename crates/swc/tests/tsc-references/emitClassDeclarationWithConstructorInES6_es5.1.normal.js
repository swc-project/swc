import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: es6
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(x) {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {};
    return A;
}();
var B = /*#__PURE__*/ function() {
    "use strict";
    function B(x) {
        var z = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "hello";
        for(var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            args[_key - 2] = arguments[_key];
        }
        _class_call_check(this, B);
        this.x = "hello";
        this.y = 10;
    }
    var _proto = B.prototype;
    _proto.baz = function baz(z, v) {
        return this._bar;
    };
    return B;
}();
