//// [utils/errors.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
var FancyError = /*#__PURE__*/ function(Error1) {
    function FancyError(status) {
        return _class_call_check(this, FancyError), _call_super(this, FancyError, [
            "error with status ".concat(status)
        ]);
    }
    return _inherits(FancyError, Error1), FancyError;
}(_wrap_native_super(Error));
module.exports = {
    FancyError: FancyError
};
//// [utils/index.js]
var errors = require("./errors");
module.exports = {
    errors: errors
};
