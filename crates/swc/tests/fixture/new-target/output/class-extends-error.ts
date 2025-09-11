import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
var CustomError = /*#__PURE__*/ function _target(Error1) {
    "use strict";
    _inherits(CustomError, Error1);
    function CustomError(message) {
        _class_call_check(this, CustomError);
        var _this;
        _this = _call_super(this, CustomError, [
            message
        ]); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(_this, (_instanceof(this, CustomError) ? this.constructor : void 0).prototype); // restore prototype chain
        return _this;
    }
    return CustomError;
}(_wrap_native_super(Error));
