import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @Filename: foo1.ts
var x = 10;
var y = 20;
module.exports = x;
module.exports = y;
// @Filename: foo2.ts
var x = 10;
var y = function y() {
    "use strict";
    _class_call_check(this, y);
};
module.exports = x;
module.exports = y;
(function(x1) {
    var _$x = x1.x = 10;
})(x || (x = {}));
var y = function y() {
    "use strict";
    _class_call_check(this, y);
};
module.exports = x;
module.exports = y;
// @Filename: foo4.ts
module.exports = x;
function x() {
    return 42;
}
function y() {
    return 42;
}
module.exports = y;
// @Filename: foo5.ts
var x = 5;
var y = "test";
var z = {};
module.exports = x;
module.exports = y;
module.exports = z;
export { };
