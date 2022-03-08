import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: utils/errors.js
var FancyError = /*#__PURE__*/ function(Error) {
    "use strict";
    swcHelpers.inherits(FancyError, Error);
    var _super = swcHelpers.createSuper(FancyError);
    function FancyError(status) {
        swcHelpers.classCallCheck(this, FancyError);
        return _super.call(this, "error with status ".concat(status));
    }
    return FancyError;
}(swcHelpers.wrapNativeSuper(Error));
module.exports = {
    FancyError: FancyError
};
// @filename: utils/index.js
// issue arises here on compilation
var errors = require("./errors");
module.exports = {
    errors: errors
};
