import * as swcHelpers from "@swc/helpers";
var c2, c3, C1 = function(x) {
    swcHelpers.classCallCheck(this, C1), this.x = x;
};
(void 0).x;
var C2 = function(p) {
    swcHelpers.classCallCheck(this, C2), this.p = p;
};
c2.p;
var C3 = function(p) {
    swcHelpers.classCallCheck(this, C3), this.p = p;
};
c3.p;
var Derived = function(C31) {
    swcHelpers.inherits(Derived, C31);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(p) {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this, p)).p, _this;
    }
    return Derived;
}(C3);
