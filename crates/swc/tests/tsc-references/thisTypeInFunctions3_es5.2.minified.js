import * as swcHelpers from "@swc/helpers";
var Test = function(Base) {
    "use strict";
    swcHelpers.inherits(Test, Base);
    var _super = swcHelpers.createSuper(Test);
    function Test() {
        return swcHelpers.classCallCheck(this, Test), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Test, [
        {
            key: "m",
            value: function() {
                this.check(this);
            }
        }
    ]), Test;
}(Base);
