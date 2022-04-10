import * as swcHelpers from "@swc/helpers";
var Base = function(x) {
    swcHelpers.classCallCheck(this, Base), this.a = 1, this.a = x;
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived;
}(Base);
new Derived(), new Derived(1);
var Base2 = function(x) {
    swcHelpers.classCallCheck(this, Base2), this.a = x;
}, D = function(Base21) {
    swcHelpers.inherits(D, Base21);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D;
}(Base2);
new D(), new D(new Date());
