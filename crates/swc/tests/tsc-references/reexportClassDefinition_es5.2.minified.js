import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var x = function() {
    "use strict";
    _class_call_check(this, x);
};
module.exports = x;
var foo1 = require("./foo1");
module.exports = {
    x: foo1
};
var x = function(_x) {
    "use strict";
    _inherits(x, _x);
    var _super = _create_super(x);
    function x() {
        return _class_call_check(this, x), _super.apply(this, arguments);
    }
    return x;
}(require("./foo2").x);
