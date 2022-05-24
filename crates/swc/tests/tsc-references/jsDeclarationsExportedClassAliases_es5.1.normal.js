import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _wrap_native_super from "@swc/helpers/lib/_wrap_native_super.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @declaration: true
// @filename: utils/errors.js
var FancyError = /*#__PURE__*/ function(Error) {
    "use strict";
    _inherits(FancyError, Error);
    var _super = _create_super(FancyError);
    function FancyError(status) {
        _class_call_check(this, FancyError);
        return _super.call(this, "error with status ".concat(status));
    }
    return FancyError;
}(_wrap_native_super(Error));
module.exports = {
    FancyError: FancyError
};
// @filename: utils/index.js
// issue arises here on compilation
var errors = require("./errors");
module.exports = {
    errors: errors
};
