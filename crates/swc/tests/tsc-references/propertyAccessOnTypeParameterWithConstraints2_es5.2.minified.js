import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
}();
new C().f(), new C().g(new B()), i.foo.foo(), i.foo.foo(), a().foo(), a().foo();
var aB = new B();
a(aB, aB).foo(), a(aB, aB).foo(), ({
    foo: function(x, y) {
        return x.foo() + x.foo();
    }
}).foo(aB, aB);
