import * as swcHelpers from "@swc/helpers";
// @module: commonjs
// @Filename: foo1.ts
var x = function x() {
    "use strict";
    swcHelpers.classCallCheck(this, x);
};
module.exports = x;
// @Filename: foo2.ts
var foo1 = require('./foo1');
var x = foo1;
var y = /*#__PURE__*/ function(x1) {
    "use strict";
    swcHelpers.inherits(y, x1);
    var _super = swcHelpers.createSuper(y);
    function y() {
        swcHelpers.classCallCheck(this, y);
        return _super.apply(this, arguments);
    }
    return y;
}(x);
export { };
