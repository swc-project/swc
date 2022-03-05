import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
module.exports = function _class(p) {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.t = 12 + p;
};
module.exports.Sub = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.instance = new module.exports(10);
};
