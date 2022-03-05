import * as swcHelpers from "@swc/helpers";
var C2 = function(Mixed1) {
    "use strict";
    swcHelpers.inherits(C2, Mixed1);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        var _this;
        return swcHelpers.classCallCheck(this, C2), (_this = _super.call(this, "hello")).a, _this.b, _this.p, _this;
    }
    return C2;
}(Mixed1), C3 = function(Mixed3) {
    "use strict";
    swcHelpers.inherits(C3, Mixed3);
    var _super = swcHelpers.createSuper(C3);
    function C3() {
        var _this;
        return swcHelpers.classCallCheck(this, C3), (_this = _super.call(this, 42)).a, _this.b, _this.p, _this.f(), _this;
    }
    return swcHelpers.createClass(C3, [
        {
            key: "f",
            value: function() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(C3.prototype), "f", this).call(this);
            }
        }
    ]), C3;
}(Mixed3);
