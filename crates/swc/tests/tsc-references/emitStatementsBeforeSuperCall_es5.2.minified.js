import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Sub = function(Base1) {
    "use strict";
    swcHelpers.inherits(Sub, Base1);
    var _super = swcHelpers.createSuper(Sub);
    function Sub(p) {
        var _this;
        return swcHelpers.classCallCheck(this, Sub), console.log('hi'), (_this = _super.call(this)).p = p, _this.field = 0, _this;
    }
    return Sub;
}(Base), Test = function(Base2) {
    "use strict";
    swcHelpers.inherits(Test, Base2);
    var _super = swcHelpers.createSuper(Test);
    function Test(p) {
        var _this;
        return swcHelpers.classCallCheck(this, Test), (_this = _super.call(this)).p = p, _this.prop = 1, _this;
    }
    return Test;
}(Base);
