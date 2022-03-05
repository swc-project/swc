import * as swcHelpers from "@swc/helpers";
var D0 = // Error, no Base constructor function
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(D0, Base);
    var _super = swcHelpers.createSuper(D0);
    function D0() {
        swcHelpers.classCallCheck(this, D0);
        return _super.apply(this, arguments);
    }
    return D0;
}(Base);
var D1 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(D1, _superClass);
    var _super = swcHelpers.createSuper(D1);
    function D1() {
        swcHelpers.classCallCheck(this, D1);
        var _this;
        _this = _super.call(this, "abc", "def");
        _this.x = "x";
        _this.y = "y";
        return _this;
    }
    return D1;
}(getBase());
var D2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(D2, _superClass);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        var _this;
        _this = _super.call(this, 10);
        _this = _super.call(this, 10, 20);
        _this.x = 1;
        _this.y = 2;
        return _this;
    }
    return D2;
}(getBase());
var D3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(D3, _superClass);
    var _super = swcHelpers.createSuper(D3);
    function D3() {
        swcHelpers.classCallCheck(this, D3);
        var _this;
        _this = _super.call(this, "abc", 42);
        _this.x = "x";
        _this.y = 2;
        return _this;
    }
    return D3;
}(getBase());
var D4 = // Error, no constructors with three type arguments
/*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(D4, _superClass);
    var _super = swcHelpers.createSuper(D4);
    function D4() {
        swcHelpers.classCallCheck(this, D4);
        return _super.apply(this, arguments);
    }
    return D4;
}(getBase());
var D5 = // Error, constructor return types differ
/*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(D5, _superClass);
    var _super = swcHelpers.createSuper(D5);
    function D5() {
        swcHelpers.classCallCheck(this, D5);
        return _super.apply(this, arguments);
    }
    return D5;
}(getBadBase());
