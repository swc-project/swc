//// [propertyAccessOnTypeParameterWithConstraints3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var i, a, A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.foo = function() {
        return "";
    }, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B.prototype.bar = function() {
        return "";
    }, B;
}(A), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.f = function() {
        var x;
        return x.foo() + x.foo();
    }, _proto.g = function(x) {
        return x.foo() + x.foo();
    }, C;
}(), r1a = new C().f(), r1b = new C().g(new B()), r2 = i.foo.foo(), r2b = i.foo.foo(), r3 = a().foo(), r3b = a().foo(), r3c = a(new B()).foo(), r3d = a(new B()).foo(), b = {
    foo: function(x) {
        return x.foo() + x.foo();
    }
}, r4 = b.foo(new B());
