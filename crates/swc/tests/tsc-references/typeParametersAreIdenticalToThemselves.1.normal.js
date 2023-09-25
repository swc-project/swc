//// [typeParametersAreIdenticalToThemselves.ts]
// type parameters from the same declaration are identical to themself
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo1(x) {}
function foo2(x) {}
function foo3(x, y) {
    function inner(x) {}
    function inner2(x) {}
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo1 = function foo1(x) {};
    _proto.foo2 = function foo2(a, x) {};
    _proto.foo3 = function foo3(x) {};
    _proto.foo4 = function foo4(x) {};
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.foo1 = function foo1(x) {};
    _proto.foo2 = function foo2(a, x) {};
    _proto.foo3 = function foo3(x) {};
    return C2;
}();
