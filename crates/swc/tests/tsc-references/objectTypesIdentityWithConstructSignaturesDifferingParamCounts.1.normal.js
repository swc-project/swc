//// [objectTypesIdentityWithConstructSignaturesDifferingParamCounts.ts]
// object types are identical structurally
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var B = function B(x, y) {
    "use strict";
    _class_call_check(this, B);
    return null;
};
var C = function C(x, y) {
    "use strict";
    _class_call_check(this, C);
    return null;
};
var a;
var b = {
    new: function _new(x) {
        return '';
    }
}; // not a construct signature, function called new
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
function foo15(x) {}
