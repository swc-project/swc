import * as swcHelpers from "@swc/helpers";
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        swcHelpers.classCallCheck(this, C1);
    }
    swcHelpers.createClass(C1, [
        {
            key: "f",
            value: function f(x) {
                return undefined;
            }
        }
    ]);
    return C1;
}();
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
var C3 = function C3() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
var C5 = /*#__PURE__*/ function() {
    "use strict";
    function C5() {
        swcHelpers.classCallCheck(this, C5);
    }
    swcHelpers.createClass(C5, [
        {
            key: "foo",
            value: function foo() {
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
            }
        },
        {
            key: "bar",
            value: function bar() {
                var x1 = undefined;
                var x2 = undefined;
            }
        }
    ]);
    return C5;
}();
