import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Sub, Base);
    var _super = swcHelpers.createSuper(Sub);
    function Sub() {
        swcHelpers.classCallCheck(this, Sub);
        return _super.apply(this, arguments);
    }
    var _proto = Sub.prototype;
    _proto.bar = function bar() {};
    return Sub;
}(Base);
