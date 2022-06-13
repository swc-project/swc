import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
