import * as swcHelpers from "@swc/helpers";
function foo() {}
new foo();
var C = function(foo1) {
    "use strict";
    swcHelpers.inherits(C, foo1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(foo);
