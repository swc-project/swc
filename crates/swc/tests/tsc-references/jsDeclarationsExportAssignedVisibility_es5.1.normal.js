import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: obj.js
module.exports = function Obj1() {
    "use strict";
    _class_call_check(this, Obj1);
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
