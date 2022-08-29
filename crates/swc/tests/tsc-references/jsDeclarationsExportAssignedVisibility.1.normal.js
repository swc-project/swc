//// [obj.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = function Obj() {
    "use strict";
    _class_call_check(this, Obj);
    this.x = 12;
};
//// [index.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Obj = require("./obj");
var Container = function Container() {
    "use strict";
    _class_call_check(this, Container);
    this.usage = new Obj();
};
module.exports = Container;
