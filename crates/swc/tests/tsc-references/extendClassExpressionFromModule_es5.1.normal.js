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
var x = foo1;
var y = /*#__PURE__*/ function(x1) {
    "use strict";
    _inherits(y, x1);
    var _super = _create_super(y);
    function y() {
        _class_call_check(this, y);
        return _super.apply(this, arguments);
    }
    return y;
}(x);
export { };
