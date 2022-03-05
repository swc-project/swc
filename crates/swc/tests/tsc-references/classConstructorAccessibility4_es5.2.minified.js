import * as swcHelpers from "@swc/helpers";
var A1 = function() {
    "use strict";
    function A1() {
        swcHelpers.classCallCheck(this, A1);
    }
    return swcHelpers.createClass(A1, [
        {
            key: "method",
            value: function() {
                var B = function() {
                    function B() {
                        swcHelpers.classCallCheck(this, B);
                    }
                    return swcHelpers.createClass(B, [
                        {
                            key: "method",
                            value: function() {
                                new A1();
                            }
                        }
                    ]), B;
                }(), C = function(A2) {
                    swcHelpers.inherits(C, A2);
                    var _super = swcHelpers.createSuper(C);
                    function C() {
                        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
                    }
                    return C;
                }(A1);
            }
        }
    ]), A1;
}(), D1 = function() {
    "use strict";
    function D1() {
        swcHelpers.classCallCheck(this, D1);
    }
    return swcHelpers.createClass(D1, [
        {
            key: "method",
            value: function() {
                var E = function() {
                    function E() {
                        swcHelpers.classCallCheck(this, E);
                    }
                    return swcHelpers.createClass(E, [
                        {
                            key: "method",
                            value: function() {
                                new D1();
                            }
                        }
                    ]), E;
                }(), F = function(D2) {
                    swcHelpers.inherits(F, D2);
                    var _super = swcHelpers.createSuper(F);
                    function F() {
                        return swcHelpers.classCallCheck(this, F), _super.apply(this, arguments);
                    }
                    return F;
                }(D1);
            }
        }
    ]), D1;
}();
