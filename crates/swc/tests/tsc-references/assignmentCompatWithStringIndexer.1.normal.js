//// [assignmentCompatWithStringIndexer.ts]
// index signatures must be compatible in assignments
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
(function(Generics) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        function B() {
            _class_call_check(this, B);
            return _call_super(this, B, arguments);
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
        function B2() {
            _class_call_check(this, B2);
            return _call_super(this, B2, arguments);
        }
        return B2;
    }(A);
    var b2;
    a1 = b2; // ok
    b2 = a1; // error
    function foo() {
        var b3;
        var a3;
        a3 = b3; // error
        b3 = a3; // error
        var b4;
        a3 = b4; // error
        b4 = a3; // error
    }
})(Generics || (Generics = {}));
var Generics;
