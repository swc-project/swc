//// [utils/errors.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var FancyError = function(Error1) {
    _inherits(FancyError, Error1);
    var _super = _create_super(FancyError);
    function FancyError(status) {
        return _class_call_check(this, FancyError), _super.call(this, "error with status ".concat(status));
    }
    return FancyError;
}(_wrap_native_super(Error));
module.exports = {
    FancyError: FancyError
};
//// [utils/index.js]
var errors = require("./errors");
module.exports = {
    errors: errors
};
