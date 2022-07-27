// @Filename: foo1.ts
var x = 10;
var y = 20;
module.exports = x;
export { };
// @Filename: foo2.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = 10;
var y = function y() {
    "use strict";
    _class_call_check(this, y);
};
module.exports = x;
export { };
// @Filename: foo3.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x;
(function(x) {
    var _$x = x.x = 10;
})(x || (x = {}));
var y = function y() {
    "use strict";
    _class_call_check(this, y);
};
module.exports = x;
export { };
// @Filename: foo4.ts
function x() {
    return 42;
}
function y() {
    return 42;
}
module.exports = x;
export { };
// @Filename: foo5.ts
var x = 5;
var y = "test";
var z = {};
module.exports = x;
export { };
