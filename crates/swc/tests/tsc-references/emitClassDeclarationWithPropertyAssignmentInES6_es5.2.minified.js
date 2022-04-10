import * as swcHelpers from "@swc/helpers";
var C = function() {
    swcHelpers.classCallCheck(this, C), this.x = "Hello world";
}, D = function() {
    swcHelpers.classCallCheck(this, D), this.x = "Hello world", this.y = 10;
}, E = function(D1) {
    swcHelpers.inherits(E, D1);
    var _super = swcHelpers.createSuper(E);
    function E() {
        var _this;
        return swcHelpers.classCallCheck(this, E), _this = _super.apply(this, arguments), _this.z = !0, _this;
    }
    return E;
}(D), F = function(D2) {
    swcHelpers.inherits(F, D2);
    var _super = swcHelpers.createSuper(F);
    function F() {
        var _this;
        return swcHelpers.classCallCheck(this, F), (_this = _super.call(this)).z = !0, _this.j = "HI", _this;
    }
    return F;
}(D);
