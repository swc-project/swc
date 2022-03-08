import * as swcHelpers from "@swc/helpers";
var Base = function Base(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(Base);
var r = C;
var c = new C(); // error
var c2 = new C(1); // ok
var Base2 = function Base2(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(D, Base2);
    var _super = swcHelpers.createSuper(D);
    function D() {
        swcHelpers.classCallCheck(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(Base2);
var r2 = D;
var d = new D(); // error
var d2 = new D(1); // ok
// specialized base class
var D2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(D2, Base2);
    var _super = swcHelpers.createSuper(D2);
    function D2() {
        swcHelpers.classCallCheck(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(Base2);
var r3 = D2;
var d3 = new D(); // error
var d4 = new D(1); // ok
var D3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(D3, Base2);
    var _super = swcHelpers.createSuper(D3);
    function D3() {
        swcHelpers.classCallCheck(this, D3);
        return _super.apply(this, arguments);
    }
    return D3;
}(Base2);
var r4 = D3;
var d5 = new D(); // error
var d6 = new D(1); // ok
