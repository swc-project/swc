import * as swcHelpers from "@swc/helpers";
var x = function() {
    "use strict";
    swcHelpers.classCallCheck(this, x);
};
module.exports = x;
var foo1 = require('./foo1');
module.exports = {
    x: foo1
};
var x = function(_x) {
    "use strict";
    swcHelpers.inherits(x, _x);
    var _super = swcHelpers.createSuper(x);
    function x() {
        return swcHelpers.classCallCheck(this, x), _super.apply(this, arguments);
    }
    return x;
}(require('./foo2').x);
