import * as swcHelpers from "@swc/helpers";
// @declaration: true
var A1 = /*#__PURE__*/ function() {
    "use strict";
    function A1() {
        swcHelpers.classCallCheck(this, A1);
    }
    var _proto1 = A1.prototype;
    _proto1.method = function method() {
        var B = /*#__PURE__*/ function() {
            function B() {
                swcHelpers.classCallCheck(this, B);
            }
            var _proto = B.prototype;
            _proto.method = function method() {
                new A1(); // OK
            };
            return B;
        }();
        var C = /*#__PURE__*/ function(A2) {
            swcHelpers.inherits(C, A2);
            var _super = swcHelpers.createSuper(C);
            function C() {
                swcHelpers.classCallCheck(this, C);
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
        swcHelpers.classCallCheck(this, D1);
    }
    var _proto2 = D1.prototype;
    _proto2.method = function method() {
        var E = /*#__PURE__*/ function() {
            function E() {
                swcHelpers.classCallCheck(this, E);
            }
            var _proto = E.prototype;
            _proto.method = function method() {
                new D1(); // OK
            };
            return E;
        }();
        var F = /*#__PURE__*/ function(D2) {
            swcHelpers.inherits(F, D2);
            var _super = swcHelpers.createSuper(F);
            function F() {
                swcHelpers.classCallCheck(this, F);
                return _super.apply(this, arguments);
            }
            return F;
        }(D1);
    };
    return D1;
}();
