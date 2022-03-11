import * as swcHelpers from "@swc/helpers";
// A | B is equivalent to A if B is a subtype of A
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
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    return D;
}(C);
var x;
var x;
// A | B is equivalent to B | A.
var y;
var y;
// AB | C is equivalent to A | BC, where AB is A | B and BC is B | C.
var z;
var z;
var z;
var AB;
var BC;
var z1;
var z1;
