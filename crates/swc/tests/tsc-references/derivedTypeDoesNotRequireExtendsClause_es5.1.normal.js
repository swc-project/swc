import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = function Derived() {
    "use strict";
    swcHelpers.classCallCheck(this, Derived);
};
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
var b;
var d1;
var d2;
b = d1;
b = d2;
var r = [
    d1,
    d2
];
