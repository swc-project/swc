var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _instanceof = require("@swc/helpers/_/_instanceof");
var _wrap_native_super = require("@swc/helpers/_/_wrap_native_super");
var CustomError = /*#__PURE__*/ function _target(Error1) {
    "use strict";
    _inherits._(CustomError, Error1);
    function CustomError(message) {
        _class_call_check._(this, CustomError);
        var _this;
        _this = _call_super._(this, CustomError, [
            message
        ]); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(_this, (_instanceof._(this, CustomError) ? this.constructor : void 0).prototype); // restore prototype chain
        return _this;
    }
    return CustomError;
}(_wrap_native_super._(Error));
