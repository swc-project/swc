import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Sub, Base);
    var _super = swcHelpers.createSuper(Sub);
    function Sub(p) {
        swcHelpers.classCallCheck(this, Sub);
        var _this;
        console.log('hi'); // should emit before super
        _this = _super.call(this);
        _this.p = p;
        _this.field = 0;
        return _this;
    }
    return Sub;
}(Base);
var Test = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Test, Base);
    var _super = swcHelpers.createSuper(Test);
    function Test(p) {
        swcHelpers.classCallCheck(this, Test);
        var _this;
        1; // should emit before super
        _this = _super.call(this);
        _this.p = p;
        _this.prop = 1;
        return _this;
    }
    return Test;
}(Base);
