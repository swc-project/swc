import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var x = function() {
    "use strict";
    _class_call_check(this, x);
};
module.exports = x;
var x = require("./foo1"), y = function(x1) {
    "use strict";
    _inherits(y, x1);
    var _super = _create_super(y);
    function y() {
        return _class_call_check(this, y), _super.apply(this, arguments);
    }
    return y;
}(x);
