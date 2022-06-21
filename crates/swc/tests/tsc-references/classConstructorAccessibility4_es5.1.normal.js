import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @declaration: true
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.method = function method() {
        var B = /*#__PURE__*/ function() {
            function B() {
                _class_call_check(this, B);
            }
            var _proto = B.prototype;
            _proto.method = function method() {
                new A(); // OK
            };
            return B;
        }();
        var C = /*#__PURE__*/ function(A) {
            _inherits(C, A);
            var _super = _create_super(C);
            function C() {
                _class_call_check(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(A);
    };
    return A;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    _proto.method = function method() {
        var E = /*#__PURE__*/ function() {
            function E() {
                _class_call_check(this, E);
            }
            var _proto = E.prototype;
            _proto.method = function method() {
                new D(); // OK
            };
            return E;
        }();
        var F = /*#__PURE__*/ function(D) {
            _inherits(F, D);
            var _super = _create_super(F);
            function F() {
                _class_call_check(this, F);
                return _super.apply(this, arguments);
            }
            return F;
        }(D);
    };
    return D;
}();
