import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
var a;
var b;
a = b; // ok
b = a; // error
var b2;
a = b2; // ok
b2 = a; // error
var Generics;
(function(Generics) {
    var foo = function foo() {
        var b3;
        var a3;
        a3 = b3; // error
        b3 = a3; // error
        var b4;
        a3 = b4; // error
        b4 = a3; // error
    };
    var A = function A() {
        "use strict";
        swcHelpers.classCallCheck(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        swcHelpers.inherits(B, A);
        var _super = swcHelpers.createSuper(B);
        function B() {
            swcHelpers.classCallCheck(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(A);
    var b1;
    var a1;
    a1 = b1; // ok
    b1 = a1; // error
    var B2 = /*#__PURE__*/ function(A) {
        "use strict";
        swcHelpers.inherits(B2, A);
        var _super = swcHelpers.createSuper(B2);
        function B2() {
            swcHelpers.classCallCheck(this, B2);
            return _super.apply(this, arguments);
        }
        return B2;
    }(A);
    var b21;
    a1 = b21; // ok
    b21 = a1; // error
})(Generics || (Generics = {}));
