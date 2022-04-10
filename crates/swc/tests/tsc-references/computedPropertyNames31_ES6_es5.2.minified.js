import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.bar = function() {
        return 0;
    }, Base;
}(), C = function(Base) {
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.foo = function() {
        return 0;
    }, C;
}(Base);
