import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        return swcHelpers.possibleConstructorReturn(_this);
    }
    return Derived;
}(Base);
var Base2 = function Base2() {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        var _this = this;
        swcHelpers.classCallCheck(this, Derived2);
        var _this1;
        var r2 = function() {
            return _this1 = _super.call(_this);
        }; // error for misplaced super call (nested function)
        return swcHelpers.possibleConstructorReturn(_this1);
    }
    return Derived2;
}(Base2);
var Derived3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived3, Base2);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        swcHelpers.classCallCheck(this, Derived3);
        var _this;
        var r = function r() {
            super();
        } // error
        ;
        return swcHelpers.possibleConstructorReturn(_this);
    }
    return Derived3;
}(Base2);
var Derived4 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived4, Base2);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4() {
        swcHelpers.classCallCheck(this, Derived4);
        var _this;
        var r = _this = _super.call(this); // ok
        return swcHelpers.possibleConstructorReturn(_this);
    }
    return Derived4;
}(Base2);
