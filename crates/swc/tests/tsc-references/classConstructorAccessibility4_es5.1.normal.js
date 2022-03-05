import * as swcHelpers from "@swc/helpers";
var A1 = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function A1() {
        swcHelpers.classCallCheck(this, A1);
    }
    swcHelpers.createClass(A1, [
        {
            key: "method",
            value: function method() {
                var B = /*#__PURE__*/ function() {
                    function B() {
                        swcHelpers.classCallCheck(this, B);
                    }
                    swcHelpers.createClass(B, [
                        {
                            key: "method",
                            value: function method() {
                                new A1(); // OK
                            }
                        }
                    ]);
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
            }
        }
    ]);
    return A1;
}();
var D1 = /*#__PURE__*/ function() {
    "use strict";
    function D1() {
        swcHelpers.classCallCheck(this, D1);
    }
    swcHelpers.createClass(D1, [
        {
            key: "method",
            value: function method() {
                var E = /*#__PURE__*/ function() {
                    function E() {
                        swcHelpers.classCallCheck(this, E);
                    }
                    swcHelpers.createClass(E, [
                        {
                            key: "method",
                            value: function method() {
                                new D1(); // OK
                            }
                        }
                    ]);
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
            }
        }
    ]);
    return D1;
}();
