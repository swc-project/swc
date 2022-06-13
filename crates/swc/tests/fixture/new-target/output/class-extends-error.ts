import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
