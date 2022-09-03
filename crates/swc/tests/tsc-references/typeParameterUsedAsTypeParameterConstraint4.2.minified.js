//// [typeParameterUsedAsTypeParameterConstraint4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return x;
    }, C;
}();
function foo(x, y) {}
function foo2(x, y) {}
var f3 = function(x, y) {}, f4 = function(x, y) {};
