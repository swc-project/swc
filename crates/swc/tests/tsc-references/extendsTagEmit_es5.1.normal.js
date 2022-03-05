import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: esnext
// @outDir: out
// @Filename: super.js
export var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var C = /** @extends {Mismatch} */ /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
