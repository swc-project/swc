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
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
    }
    _createClass(C1, [
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
    _classCallCheck(this, C2);
};
var C3 = function C3() {
    "use strict";
    _classCallCheck(this, C3);
};
var C5 = /*#__PURE__*/ function() {
    "use strict";
    function C5() {
        _classCallCheck(this, C5);
    }
    _createClass(C5, [
        {
            key: "foo",
            value: function foo() {
                var _this4 = this, _this1 = this, _this2 = this, _this3 = this;
                var f1 = function(x) {
                    return _this4;
                };
                var f2 = function(x) {
                    return _this1;
                };
                var f3 = function(x) {
                    return function(y) {
                        return _this2;
                    };
                };
                var f4 = function(x) {
                    var _this = _this3;
                    var g = function(y) {
                        var _this5 = _this;
                        return function() {
                            return _this5;
                        };
                    };
                    return g(_this3);
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
