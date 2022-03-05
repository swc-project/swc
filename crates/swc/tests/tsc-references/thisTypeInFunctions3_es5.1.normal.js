import * as swcHelpers from "@swc/helpers";
var Test = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Test, Base);
    var _super = swcHelpers.createSuper(Test);
    function Test() {
        swcHelpers.classCallCheck(this, Test);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Test, [
        {
            key: "m",
            value: function m() {
                this.check(this);
            }
        }
    ]);
    return Test;
}(Base);
