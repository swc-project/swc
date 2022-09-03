//// [stringLiteralTypesInImplementationSignatures2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
function foo(x) {}
var a, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}(), b = _define_property({
    foo: function(x) {}
}, "foo", function(x) {});
