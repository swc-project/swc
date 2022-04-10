import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C(x) {
        swcHelpers.classCallCheck(this, C);
    }
    return C.foo = function(x) {}, C.bar = function(x) {}, C;
}(), D = function(C) {
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function() {}, D.baz = function(x) {}, D;
}(C);
