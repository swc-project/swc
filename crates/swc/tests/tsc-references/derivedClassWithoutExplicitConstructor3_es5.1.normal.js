import * as swcHelpers from "@swc/helpers";
// automatic constructors with a class hieararchy of depth > 2
var Base = function Base(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.a = 1;
    this.a = x;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(y, z) {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, 2);
        _this.b = "";
        _this.b = y;
        return _this;
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        _this.y = "hello";
        return _this;
    }
    return Derived2;
}(Derived);
var r = new Derived(); // error
var r2 = new Derived2(1); // error
var r3 = new Derived("", "");
var Base2 = function Base2(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(D, Base);
    var _super = swcHelpers.createSuper(D);
    function D(y, z) {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.call(this, 2);
        _this.b = null;
        _this.b = y;
        return _this;
    }
    return D;
}(Base);
var D2 = /*#__PURE__*/ function(D) {
    "use strict";
    swcHelpers.inherits(D2, D);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 2;
        _this.y = null;
        return _this;
    }
    return D2;
}(D);
var d = new D2(); // error
var d2 = new D2(new Date()); // error
var d3 = new D2(new Date(), new Date()); // ok
