import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
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
var E = /*#__PURE__*/ function(C2) {
    "use strict";
    swcHelpers.inherits(E, C2);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(C2);
var a;
var r = a.x; // error
var r2 = a.w; // error
