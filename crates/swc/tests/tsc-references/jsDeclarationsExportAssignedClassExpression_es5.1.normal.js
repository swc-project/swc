import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
module.exports = function Thing(p) {
    "use strict";
    swcHelpers.classCallCheck(this, Thing);
    this.t = 12 + p;
};
