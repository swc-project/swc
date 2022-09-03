//// [classExpression4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.foo = function() {
        return new C();
    }, C1;
}(), x = (new C).foo();
