import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @checkJs: true
// @noEmit: true
// @Filename: bug24024.js
// #24024
var wat = require("./bug24024");
module.exports = function C() {
    "use strict";
    _class_call_check(this, C);
};
module.exports.D = function D() {
    "use strict";
    _class_call_check(this, D);
};
