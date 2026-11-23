//// [propertyAccessOnTypeParameterWithConstraints5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var B = /*#__PURE__*/ function(A) {
    function B() {
        return _class_call_check(this, B), _call_super(this, B, arguments);
    }
    return _inherits(B, A), B.prototype.bar = function() {
        return '';
    }, B;
}(/*#__PURE__*/ function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return '';
    }, A;
}());
new (/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        return (void 0).foo() + (void 0).foo() + (void 0).notHere();
    }, C;
}())().f(), (void 0).foo.notHere(), (void 0).foo.foo(), (void 0)().notHere(), (void 0)().foo();
var b = {
    foo: function(x) {
        return x.foo() + x.notHere();
    },
    bar: b.foo(1).notHere()
};
b.foo(new B());
