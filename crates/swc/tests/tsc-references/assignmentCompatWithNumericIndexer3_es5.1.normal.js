import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
var a;
var b;
a = b; // error
b = a; // ok
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
var b2;
a = b2; // ok
b2 = a; // error
var Generics;
(function(Generics) {
    var foo = function foo() {
        var a1;
        var b1;
        a1 = b1; // error
        b1 = a1; // ok
        var b21;
        a1 = b21; // ok
        b21 = a1; // ok
    };
    var A = function A() {
        "use strict";
        swcHelpers.classCallCheck(this, A);
    };
})(Generics || (Generics = {}));
