import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: obj.js
module.exports = function Obj() {
    "use strict";
    _class_call_check(this, Obj);
    this.x = 12;
};
// @filename: index.js
var Obj = require("./obj");
var Container = function Container() {
    "use strict";
    _class_call_check(this, Container);
    this.usage = new Obj();
};
module.exports = Container;
