//// [obj.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = function Obj() {
    _class_call_check(this, Obj), this.x = 12;
};
//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Obj = require("./obj");
module.exports = function Container() {
    _class_call_check(this, Container), this.usage = new Obj();
};
