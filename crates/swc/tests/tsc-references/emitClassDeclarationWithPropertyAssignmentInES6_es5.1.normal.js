import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.x = "Hello world";
};
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.x = "Hello world";
    this.y = 10;
};
var E = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(E, D);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        var _this;
        _this = _super.apply(this, arguments);
        _this.z = true;
        return _this;
    }
    return E;
}(D);
var F = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(F, D);
    var _super = swcHelpers.createSuper(F);
    function F() {
        swcHelpers.classCallCheck(this, F);
        var _this;
        _this = _super.call(this);
        _this.z = true;
        _this.j = "HI";
        return _this;
    }
    return F;
}(D);
