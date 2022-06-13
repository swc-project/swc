import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @declaration: true
var A1 = /*#__PURE__*/ function() {
    "use strict";
    function A1() {
        _class_call_check(this, A1);
    }
    var _proto1 = A1.prototype;
    _proto1.method = function method() {
        var B = /*#__PURE__*/ function() {
            function B() {
                _class_call_check(this, B);
            }
            var _proto = B.prototype;
            _proto.method = function method() {
                new A1(); // OK
            };
            return B;
        }();
        var C = /*#__PURE__*/ function(A2) {
            _inherits(C, A2);
            var _super = _create_super(C);
            function C() {
                _class_call_check(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(A1);
    };
    return A1;
}();
var D1 = /*#__PURE__*/ function() {
    "use strict";
    function D1() {
        _class_call_check(this, D1);
    }
    var _proto2 = D1.prototype;
    _proto2.method = function method() {
        var E = /*#__PURE__*/ function() {
            function E() {
                _class_call_check(this, E);
            }
            var _proto = E.prototype;
            _proto.method = function method() {
                new D1(); // OK
            };
            return E;
        }();
        var F = /*#__PURE__*/ function(D2) {
            _inherits(F, D2);
            var _super = _create_super(F);
            function F() {
                _class_call_check(this, F);
                return _super.apply(this, arguments);
            }
            return F;
        }(D1);
    };
    return D1;
}();
