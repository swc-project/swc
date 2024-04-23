//// [objectTypesIdentityWithCallSignaturesDifferingParamCounts.ts]
// object types are identical structurally
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo(x) {
        return null;
    };
    return A;
}();
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.foo = function foo(x, y) {
        return null;
    };
    return B;
}();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, y) {
        return null;
    };
    return C;
}();
var a;
var b = {
    foo: function foo(x) {
        return '';
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
