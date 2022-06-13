import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = {
    a: "test",
    b: 42
};
var C1 = function() {
    "use strict";
    _class_call_check(this, C1);
};
module.exports = C1;
var C1 = function() {
    "use strict";
    _class_call_check(this, C1);
};
module.exports = C1;
