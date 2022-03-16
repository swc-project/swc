import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: obj.js
module.exports = function Obj1() {
    "use strict";
    swcHelpers.classCallCheck(this, Obj1);
    this.x = 12;
};
// @filename: index.js
var Obj = require("./obj");
var Container = function Container() {
    "use strict";
    swcHelpers.classCallCheck(this, Container);
    this.usage = new Obj();
};
module.exports = Container;
