import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
        var a;
        var b;
        a = b; // error
        b = a; // ok
        var b2;
        a = b2; // ok
        b2 = a; // ok
    };
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
})(Generics || (Generics = {}));
