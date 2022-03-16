import * as swcHelpers from "@swc/helpers";
var C1 = function C1(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
    this.x = x;
};
var c1;
c1.x // OK
;
var C2 = function C2(p) {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
    this.p = p;
};
var c2;
c2.p // private, error
;
var C3 = function C3(p) {
    "use strict";
    swcHelpers.classCallCheck(this, C3);
    this.p = p;
};
var c3;
c3.p // protected, error
;
var Derived = /*#__PURE__*/ function(C3) {
    "use strict";
    swcHelpers.inherits(Derived, C3);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(p) {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, p);
        _this.p; // OK
        return _this;
    }
    return Derived;
}(C3);
