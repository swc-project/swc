//// [parametersWithNoAnnotationAreAny.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo(x) {
    return x;
}
var f = function foo(x) {
    return x;
};
var f2 = function f2(x) {
    return x;
};
var f3 = function f3(x) {
    return x;
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x) {
        return x;
    };
    return C;
}();
var a;
var b = {
    foo: function foo(x) {
        return x;
    },
    a: function foo(x) {
        return x;
    },
    b: function b(x) {
        return x;
    }
};
