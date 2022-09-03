//// [objectTypesIdentityWithGenericConstructSignaturesOptionalParams2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, B = function B(x, y) {
    return _class_call_check(this, B), null;
}, C = function C(x, y) {
    return _class_call_check(this, C), null;
}, b = {
    new: function(x, y) {
        return new C(x, y);
    }
};
function foo1b(x) {}
function foo1c(x) {}
function foo2(x) {}
function foo3(x) {}
function foo4(x) {}
function foo8(x) {}
function foo9(x) {}
function foo10(x) {}
function foo11(x) {}
function foo12(x) {}
function foo12b(x) {}
function foo13(x) {}
function foo14(x) {}
