import * as swcHelpers from "@swc/helpers";
var FancyError = function(Error) {
    swcHelpers.inherits(FancyError, Error);
    var _super = swcHelpers.createSuper(FancyError);
    function FancyError(status) {
        return swcHelpers.classCallCheck(this, FancyError), _super.call(this, "error with status ".concat(status));
    }
    return FancyError;
}(swcHelpers.wrapNativeSuper(Error));
module.exports = {
    FancyError: FancyError
};
var errors = require("./errors");
module.exports = {
    errors: errors
};
