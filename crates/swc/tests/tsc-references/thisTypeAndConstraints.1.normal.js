//// [thisTypeAndConstraints.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.self = function self() {
        return this;
    };
    return A;
}();
function f(x) {
    function g(x) {
        x = x.self();
    }
    x = x.self();
}
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    _proto.foo = function foo(x) {
        x = x.self();
    };
    _proto.bar = function bar(x) {
        x = x.self();
    };
    return B;
}();
