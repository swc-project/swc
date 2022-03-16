import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @lib: esnext
// @Filename: bug25101.js
/**
 * @template T
 * @extends {Set<T>} Should prefer this Set<T>, not the Set in the heritage clause
 */ var My = /*#__PURE__*/ function(Set) {
    "use strict";
    swcHelpers.inherits(My, Set);
    var _super = swcHelpers.createSuper(My);
    function My() {
        swcHelpers.classCallCheck(this, My);
        return _super.apply(this, arguments);
    }
    return My;
}(swcHelpers.wrapNativeSuper(Set));
