import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Sub = function(Base1) {
    swcHelpers.inherits(Sub, Base1);
    var _super = swcHelpers.createSuper(Sub);
    function Sub() {
        return swcHelpers.classCallCheck(this, Sub), _super.apply(this, arguments);
    }
    return Sub.prototype.bar = function() {}, Sub;
}(Base);
