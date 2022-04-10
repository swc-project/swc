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
    return C.prototype.f = function() {
        var x;
        return x.foo() + x.foo() + x.notHere();
    }, C;
}();
new C().f(), i.foo.notHere(), i.foo.foo(), a().notHere(), a().foo();
var b = {
    foo: function(x) {
        return x.foo() + x.notHere();
    },
    bar: b.foo(1).notHere()
};
b.foo(new B());
