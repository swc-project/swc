//// [assignmentCompatWithNumericIndexer.ts]
// Derived type indexer must be subtype of base type indexer
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var a;
var b;
a = b;
b = a; // error
var b2;
a = b2;
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
    function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // error
        var b2;
        a = b2; // error
        b2 = a; // error
        var b3;
        a = b3; // ok
        b3 = a; // ok
    }
})(Generics || (Generics = {}));
var Generics;
