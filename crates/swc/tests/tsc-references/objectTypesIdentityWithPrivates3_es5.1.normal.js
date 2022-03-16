import * as swcHelpers from "@swc/helpers";
var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
};
var C2 = /*#__PURE__*/ function(C1) {
    "use strict";
    swcHelpers.inherits(C2, C1);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        swcHelpers.classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(C1);
var c1;
c1; // Should succeed (private x originates in the same declaration)
var C3 = function C3() {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
};
var C4 = /*#__PURE__*/ function(C3) {
    "use strict";
    swcHelpers.inherits(C4, C3);
    var _super = swcHelpers.createSuper(C4);
    function C4() {
        swcHelpers.classCallCheck(this, C4);
        return _super.apply(this, arguments);
    }
    return C4;
}(C3);
var c3;
c3; // Should fail (private x originates in the same declaration, but different types)
