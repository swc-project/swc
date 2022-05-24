import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @module: commonjs
// @Filename: foo1.ts
var x = function x() {
    "use strict";
    _class_call_check(this, x);
};
module.exports = x;
// @Filename: foo2.ts
var foo1 = require("./foo1");
module.exports = {
    x: foo1
};
// @Filename: foo3.ts
var foo2 = require("./foo2");
var x = /*#__PURE__*/ function(_x) {
    "use strict";
    _inherits(x, _x);
    var _super = _create_super(x);
    function x() {
        _class_call_check(this, x);
        return _super.apply(this, arguments);
    }
    return x;
}(foo2.x);
export { };
