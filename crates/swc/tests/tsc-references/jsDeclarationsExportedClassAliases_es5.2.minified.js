import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var FancyError = function(Error1) {
    "use strict";
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
var errors = require("./errors");
module.exports = {
    errors: errors
};
