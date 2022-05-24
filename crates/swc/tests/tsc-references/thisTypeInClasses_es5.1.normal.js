import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    var _proto = C1.prototype;
    _proto.f = function f(x) {
        return undefined;
    };
    return C1;
}();
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
var C5 = /*#__PURE__*/ function() {
    "use strict";
    function C5() {
        _class_call_check(this, C5);
    }
    var _proto = C5.prototype;
    _proto.foo = function foo() {
        var _this2 = this;
        var f1 = function(x) {
            return _this2;
        };
        var f2 = function(x) {
            return _this2;
        };
        var f3 = function(x) {
            return function(y) {
                return _this2;
            };
        };
        var f4 = function(x) {
            var _this1 = _this2;
            var g = function(y) {
                var _this = _this1;
                return function() {
                    return _this;
                };
            };
            return g(_this2);
        };
    };
    _proto.bar = function bar() {
        var x1 = undefined;
        var x2 = undefined;
    };
    return C5;
}();
