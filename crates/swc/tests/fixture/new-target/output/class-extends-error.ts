import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var CustomError = /*#__PURE__*/ function _target(Error1) {
    "use strict";
    _inherits(CustomError, Error1);
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
