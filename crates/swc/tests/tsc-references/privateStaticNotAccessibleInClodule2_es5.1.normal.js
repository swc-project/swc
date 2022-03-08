import * as swcHelpers from "@swc/helpers";
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
(function(D1) {
    var y = D1.y = D.bar;
})(D || (D = {}));
