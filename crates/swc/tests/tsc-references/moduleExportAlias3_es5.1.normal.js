import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @checkJs: true
// @allowJS: true
// @noEmit: true
// @Filename: bug24062.js
// #24062
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
module.exports = {
    C: C
};
