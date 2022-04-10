import * as swcHelpers from "@swc/helpers";
var c, A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.foo = function() {
        return this;
    }, A;
}(), B = function(A) {
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B.prototype.bar = function() {
        return this;
    }, B;
}(A), C = function(B) {
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.baz = function() {
        return this;
    }, C;
}(B);
c.foo().bar().baz();
