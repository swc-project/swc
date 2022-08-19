import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = function x() {
    "use strict";
    _class_call_check(this, x);
};
module.exports = x;
var foo1 = require("./foo1");
module.exports = {
    x: foo1
};
export { };
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
require("./foo2").x;
