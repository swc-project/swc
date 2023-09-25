//// [assignmentCompatWithNumericIndexer3.ts]
// Derived type indexer must be subtype of base type indexer
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    function foo() {
        var a;
        var b;
        a = b; // error
        b = a; // ok
        var b2;
        a = b2; // ok
        b2 = a; // ok
    }
})(Generics || (Generics = {}));
