//// [propertyAccessOnTypeParameterWithConstraints2.ts]
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
}()), C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.f = function() {
        return (void 0).foo() + (void 0).foo();
    }, _proto.g = function(x) {
        return x.foo() + x.foo();
    }, C;
}();
new C().f(), new C().g(new B()), (void 0).foo.foo(), (void 0).foo.foo(), (void 0)().foo(), (void 0)().foo();
var aB = new B();
(void 0)(aB, aB).foo(), (void 0)(aB, aB).foo(), aB.foo(), aB.foo();
