import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
module.exports = function Thing(p) {
    "use strict";
    _class_call_check(this, Thing);
    this.t = 12 + p;
};
