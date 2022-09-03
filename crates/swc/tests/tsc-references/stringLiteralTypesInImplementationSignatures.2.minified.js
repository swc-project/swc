//// [stringLiteralTypesInImplementationSignatures.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {}
var a, f = function(x) {}, f2 = function(x, y) {}, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}(), b = {
    foo: function(x) {},
    a: function(x, y) {},
    b: function(x) {}
};
