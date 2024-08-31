//// [fluentClasses.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {
        return this;
    };
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    var _proto = B.prototype;
    _proto.bar = function bar() {
        return this;
    };
    return B;
}(A);
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto.baz = function baz() {
        return this;
    };
    return C;
}(B);
var c;
var z = c.foo().bar().baz(); // Fluent pattern
