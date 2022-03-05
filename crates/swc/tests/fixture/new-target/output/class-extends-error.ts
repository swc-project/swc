import * as swcHelpers from "@swc/helpers";
var CustomError = /*#__PURE__*/ function _target(Error) {
    "use strict";
    swcHelpers.inherits(CustomError, Error);
    var _super = swcHelpers.createSuper(CustomError);
    function CustomError(message) {
        swcHelpers.classCallCheck(this, CustomError);
        var _this;
        _this = _super.call(this, message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(swcHelpers.assertThisInitialized(_this), (swcHelpers._instanceof(this, CustomError) ? this.constructor : void 0).prototype); // restore prototype chain
        return _this;
    }
    return CustomError;
}(swcHelpers.wrapNativeSuper(Error));
