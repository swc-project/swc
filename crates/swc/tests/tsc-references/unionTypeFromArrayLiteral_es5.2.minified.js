import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function() {}, C;
}(), D = function() {
    function D() {
        swcHelpers.classCallCheck(this, D);
    }
    return D.prototype.foo2 = function() {}, D;
}(), E = function(C) {
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo3 = function() {}, E;
}(C), F = function(C) {
    swcHelpers.inherits(F, C);
    var _super = swcHelpers.createSuper(F);
    function F() {
        return swcHelpers.classCallCheck(this, F), _super.apply(this, arguments);
    }
    return F.prototype.foo4 = function() {}, F;
}(C);
