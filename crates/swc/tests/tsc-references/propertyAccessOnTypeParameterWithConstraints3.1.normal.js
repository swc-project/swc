//// [propertyAccessOnTypeParameterWithConstraints3.ts]
// generic types should behave as if they have properties of their constraint type
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
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    };
    _proto.g = function g(x) {
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    };
    return C;
}();
var r1a = new C().f();
var r1b = new C().g(new B());
var i;
var r2 = i.foo.foo();
var r2b = i.foo['foo']();
var a;
var r3 = a().foo(); // error, no inferences for U so it doesn't satisfy constraint
var r3b = a()['foo']();
// parameter supplied for type argument inference for U
var r3c = a(new B()).foo(); // valid call to an invalid function, U is inferred as B, which has a foo
var r3d = a(new B())['foo'](); // valid call to an invalid function, U is inferred as B, which has a foo
var b = {
    foo: function(x) {
        // BUG 823818
        var a = x['foo'](); // should be string
        return a + x.foo();
    }
};
var r4 = b.foo(new B()); // valid call to an invalid function
