import * as swcHelpers from "@swc/helpers";
var d, d2, C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.thing = function() {}, C.other = function() {}, C;
}(), D = function(C) {
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
d.foo, d.bar, d.thing(), D.other();
var C2 = function() {
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return C2.prototype.thing = function(x) {}, C2.other = function(x) {}, C2;
}(), D2 = function(C2) {
    swcHelpers.inherits(D2, C2);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        return swcHelpers.classCallCheck(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(C2);
d2.foo, d2.bar, d2.thing(""), D2.other(1);
