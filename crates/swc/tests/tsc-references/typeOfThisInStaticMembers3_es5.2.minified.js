import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.a = 1, C.b = C.a + 1;
var D = function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
D.c = 2, D.d = D.c + 1, D.e = swcHelpers.get(swcHelpers.getPrototypeOf(D), "a", D) + D.c + 1;
