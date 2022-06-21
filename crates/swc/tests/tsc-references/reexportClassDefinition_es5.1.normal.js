import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @module: commonjs
// @Filename: foo1.ts
var x = function x() {
    "use strict";
    _class_call_check(this, x);
};
// @Filename: foo2.ts
var foo1 = require("./foo1");
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
module.exports = {
    x: foo1
};
export { };
