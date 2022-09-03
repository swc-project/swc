//// [propertyAccessOnTypeParameterWithConstraints5.ts]
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
    return C.prototype.f = function() {
        var x;
        return x.foo() + x.foo() + x.notHere();
    }, C;
}(), r = new C().f(), r2 = i.foo.notHere(), r2b = i.foo.foo(), r3 = a().notHere(), r3b = a().foo(), b = {
    foo: function(x) {
        return x.foo() + x.notHere();
    },
    bar: b.foo(1).notHere()
}, r4 = b.foo(new B());
