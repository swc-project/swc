import * as swcHelpers from "@swc/helpers";
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
function foo() {
    return {
        B: B
    };
}
var C = /*#__PURE__*/ function(_B) {
    "use strict";
    swcHelpers.inherits(C, _B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(foo().B);
