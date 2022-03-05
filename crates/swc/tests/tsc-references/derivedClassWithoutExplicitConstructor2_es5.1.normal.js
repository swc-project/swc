import * as swcHelpers from "@swc/helpers";
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
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        _this.y = 'hello';
        return _this;
    }
    return Derived;
}(Base);
var r = new Derived(); // error
var r2 = new Derived(1);
var r3 = new Derived(1, 2);
var r4 = new Derived(1, 2, 3);
var Base2 = function Base2(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(D, Base2);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 2;
        _this.y = null;
        return _this;
    }
    return D;
}(Base2);
var d = new D(); // error
var d2 = new D(new Date()); // ok
var d3 = new D(new Date(), new Date());
var d4 = new D(new Date(), new Date(), new Date());
