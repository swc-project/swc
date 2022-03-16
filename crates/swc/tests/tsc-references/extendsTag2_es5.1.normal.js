import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: esnext
// @outDir: out
// @Filename: foo.js
/**
 * @constructor
 */ var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
/**
 * @extends {A}
 */ /**
 * @constructor
 */ var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.call(this);
    }
    return B;
}(A);
