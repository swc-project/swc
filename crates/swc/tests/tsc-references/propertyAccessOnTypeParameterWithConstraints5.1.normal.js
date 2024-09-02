//// [propertyAccessOnTypeParameterWithConstraints5.ts]
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
        return '';
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
        return '';
    };
    return B;
}(A);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a = x['foo'](); // should be string
        return a + x.foo() + x.notHere();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.notHere();
var r2b = i.foo['foo']();
var a;
// BUG 794164
var r3 = a().notHere();
var r3b = a()['foo']();
var b = {
    foo: function(x) {
        var a = x['foo'](); // should be string
        return a + x.notHere();
    },
    // BUG 794164
    bar: b.foo(1).notHere()
};
var r4 = b.foo(new B()); // error after constraints above made illegal, doesn't matter
