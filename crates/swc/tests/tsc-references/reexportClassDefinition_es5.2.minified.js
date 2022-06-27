import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var x = function() {
    "use strict";
    _class_call_check(this, x);
};
require("./foo1");
var x = function(_x) {
    "use strict";
    _inherits(x, _x);
    var _super = _create_super(x);
    function x() {
        return _class_call_check(this, x), _super.apply(this, arguments);
    }
    return x;
}(require("./foo2").x);
module.exports = x;
