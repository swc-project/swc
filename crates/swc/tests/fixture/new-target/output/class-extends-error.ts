import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
import _wrap_native_super from "@swc/helpers/lib/_wrap_native_super.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var CustomError = /*#__PURE__*/ function _target(Error) {
    "use strict";
    _inherits(CustomError, Error);
    var _super = _create_super(CustomError);
    function CustomError(message) {
        _class_call_check(this, CustomError);
        var _this;
        _this = _super.call(this, message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(_assert_this_initialized(_this), (_instanceof(this, CustomError) ? this.constructor : void 0).prototype); // restore prototype chain
        return _this;
    }
    return CustomError;
}(_wrap_native_super(Error));
