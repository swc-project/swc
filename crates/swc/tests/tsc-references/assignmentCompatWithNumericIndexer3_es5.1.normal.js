import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var a;
var b;
a = b; // error
b = a; // ok
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
        _class_call_check(this, A);
    };
})(Generics || (Generics = {}));
