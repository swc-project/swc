import * as swcHelpers from "@swc/helpers";
var e, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}(), D = function(C) {
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function() {}, D;
}(C), E = function(D) {
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo = function(x) {}, E;
}(D);
e.foo(1), e.foo("");
