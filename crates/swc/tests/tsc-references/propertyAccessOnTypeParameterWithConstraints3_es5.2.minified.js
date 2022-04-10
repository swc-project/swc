import * as swcHelpers from "@swc/helpers";
var i, a, A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.foo = function() {
        return "";
    }, A;
}(), B = function(A) {
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.bar = function() {
        return "";
    }, B;
}(A), C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.f = function() {
        var x;
        return x.foo() + x.foo();
    }, _proto.g = function(x) {
        return x.foo() + x.foo();
    }, C;
}();
new C().f(), new C().g(new B()), i.foo.foo(), i.foo.foo(), a().foo(), a().foo(), a(new B()).foo(), a(new B()).foo(), ({
    foo: function(x) {
        return x.foo() + x.foo();
    }
}).foo(new B());
