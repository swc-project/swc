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
module.exports = {
    x: foo1
};
// @Filename: foo3.ts
var foo2 = require('./foo2');
var x = /*#__PURE__*/ function(_x) {
    "use strict";
    swcHelpers.inherits(x, _x);
    var _super = swcHelpers.createSuper(x);
    function x() {
        swcHelpers.classCallCheck(this, x);
        return _super.apply(this, arguments);
    }
    return x;
}(foo2.x);
export { };
