import * as swcHelpers from "@swc/helpers";
var D0 = function(Base) {
    "use strict";
    swcHelpers.inherits(D0, Base);
    var _super = swcHelpers.createSuper(D0);
    function D0() {
        return swcHelpers.classCallCheck(this, D0), _super.apply(this, arguments);
    }
    return D0;
}(Base), D1 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(D1, _superClass);
    var _super = swcHelpers.createSuper(D1);
    function D1() {
        var _this;
        return swcHelpers.classCallCheck(this, D1), (_this = _super.call(this, "abc", "def")).x = "x", _this.y = "y", _this;
    }
    return D1;
}(getBase()), D2 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(D2, _superClass);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        var _this;
        return swcHelpers.classCallCheck(this, D2), _this = _super.call(this, 10), _this = _super.call(this, 10, 20), _this.x = 1, _this.y = 2, _this;
    }
    return D2;
}(getBase()), D3 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(D3, _superClass);
    var _super = swcHelpers.createSuper(D3);
    function D3() {
        var _this;
        return swcHelpers.classCallCheck(this, D3), (_this = _super.call(this, "abc", 42)).x = "x", _this.y = 2, _this;
    }
    return D3;
}(getBase()), D4 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(D4, _superClass);
    var _super = swcHelpers.createSuper(D4);
    function D4() {
        return swcHelpers.classCallCheck(this, D4), _super.apply(this, arguments);
    }
    return D4;
}(getBase()), D5 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(D5, _superClass);
    var _super = swcHelpers.createSuper(D5);
    function D5() {
        return swcHelpers.classCallCheck(this, D5), _super.apply(this, arguments);
    }
    return D5;
}(getBadBase());
