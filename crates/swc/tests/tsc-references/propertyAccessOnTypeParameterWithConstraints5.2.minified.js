//// [propertyAccessOnTypeParameterWithConstraints5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var i, a, B = function(A) {
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.bar = function() {
        return '';
    }, B;
}(function() {
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return '';
    }, A;
}());
new (function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function() {
        var x;
        return x.foo() + x.foo() + x.notHere();
    }, C;
}())().f(), i.foo.notHere(), i.foo.foo(), a().notHere(), a().foo();
var b = {
    foo: function(x) {
        return x.foo() + x.notHere();
    },
    bar: b.foo(1).notHere()
};
b.foo(new B());
