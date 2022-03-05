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
    swcHelpers.createClass(Sub, [
        {
            key: "bar",
            value: function bar() {}
        }
    ]);
    return Sub;
}(Base);
