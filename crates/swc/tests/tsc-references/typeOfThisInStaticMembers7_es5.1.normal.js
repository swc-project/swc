import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es6, es5
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.a = 1;
C.b = C.a + 1;
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
D.c = 2;
D.d = D.c + 1;
D.e = 1 + swcHelpers.get(swcHelpers.getPrototypeOf(D), "a", D) + (D.c + 1) + 1;
