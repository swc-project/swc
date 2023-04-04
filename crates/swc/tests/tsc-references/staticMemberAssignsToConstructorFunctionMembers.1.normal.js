//// [staticMemberAssignsToConstructorFunctionMembers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.foo = function foo() {
        C.foo = function() {};
    };
    C.bar = function bar(x) {
        C.bar = function() {} // error
        ;
        C.bar = function(x) {
            return x;
        }; // ok
        C.bar = function(x) {
            return 1;
        }; // ok
        return 1;
    };
    return C;
}();
