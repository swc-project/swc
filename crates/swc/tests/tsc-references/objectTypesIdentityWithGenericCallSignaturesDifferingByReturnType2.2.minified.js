//// [objectTypesIdentityWithGenericCallSignaturesDifferingByReturnType2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function(x) {
        return null;
    }, A;
}(), B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.foo = function(x) {
        return null;
    }, B;
}(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {
        return null;
    }, C;
}(), b = {
    foo: function(x) {
        return null;
    }
};
function foo1(x) {}
function foo1b(x) {}
function foo1c(x) {}
function foo2(x) {}
function foo3(x) {}
function foo4(x) {}
function foo5(x) {}
function foo5b(x) {}
function foo6(x) {}
function foo7(x) {}
function foo8(x) {}
function foo9(x) {}
function foo10(x) {}
function foo11(x) {}
function foo12(x) {}
function foo12b(x) {}
function foo13(x) {}
function foo14(x) {}
function foo15(x) {}
