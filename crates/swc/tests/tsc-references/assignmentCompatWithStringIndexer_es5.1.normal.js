import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
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
        _class_call_check(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        var _super = _create_super(B);
        function B() {
            _class_call_check(this, B);
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
        _inherits(B2, A);
        var _super = _create_super(B2);
        function B2() {
            _class_call_check(this, B2);
            return _super.apply(this, arguments);
        }
        return B2;
    }(A);
    var b21;
    a1 = b21; // ok
    b21 = a1; // error
})(Generics || (Generics = {}));
