import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var x = function() {
    "use strict";
    _class_call_check(this, x);
};
module.exports = x;
var x = require("./foo1"), y = function(x) {
    "use strict";
    _inherits(y, x);
    var _super = _create_super(y);
    function y() {
        return _class_call_check(this, y), _super.apply(this, arguments);
    }
    return y;
}(x);
