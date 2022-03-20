import * as swcHelpers from "@swc/helpers";
var x = function() {
    "use strict";
    swcHelpers.classCallCheck(this, x);
};
module.exports = x;
var x = require("./foo1"), y = function(x1) {
    "use strict";
    swcHelpers.inherits(y, x1);
    var _super = swcHelpers.createSuper(y);
    function y() {
        return swcHelpers.classCallCheck(this, y), _super.apply(this, arguments);
    }
    return y;
}(x);
