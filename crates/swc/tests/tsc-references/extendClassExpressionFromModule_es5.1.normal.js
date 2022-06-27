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
var x = foo1;
var y = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits(y, x);
    var _super = _create_super(y);
    function y() {
        _class_call_check(this, y);
        return _super.apply(this, arguments);
    }
    return y;
}(x);
module.exports = x;
export { };
