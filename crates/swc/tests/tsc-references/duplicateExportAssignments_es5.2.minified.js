import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var x = 10, y = 20;
module.exports = x, module.exports = y;
var x = 10, y = function() {
    "use strict";
    _class_call_check(this, y);
};
module.exports = x, module.exports = y, (x || (x = {})).x = 10;
var y = function() {
    "use strict";
    _class_call_check(this, y);
};
function y() {
    return 42;
}
module.exports = x, module.exports = y, module.exports = x, module.exports = y;
var x = 5, y = "test";
module.exports = x, module.exports = y, module.exports = {};
