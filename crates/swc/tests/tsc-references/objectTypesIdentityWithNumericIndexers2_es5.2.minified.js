import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
}, B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
}, PA = function(A1) {
    "use strict";
    swcHelpers.inherits(PA, A1);
    var _super = swcHelpers.createSuper(PA);
    function PA() {
        return swcHelpers.classCallCheck(this, PA), _super.apply(this, arguments);
    }
    return PA;
}(A), PB = function(B1) {
    "use strict";
    swcHelpers.inherits(PB, B1);
    var _super = swcHelpers.createSuper(PB);
    function PB() {
        return swcHelpers.classCallCheck(this, PB), _super.apply(this, arguments);
    }
    return PB;
}(B);
