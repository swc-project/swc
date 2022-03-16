import * as swcHelpers from "@swc/helpers";
function foo() {}
var x = new foo(); // can be used as a constructor function
var C = /*#__PURE__*/ function(foo1) {
    "use strict";
    swcHelpers.inherits(C, foo1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error, cannot extend it though
(foo);
