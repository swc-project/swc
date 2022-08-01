import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
};
export function func() {}
export * from "./cls";
export * from "./func";
export * from "./cls";
import { Foo } from "./cls";
export { Foo };
import * as ns from "./cls";
export default ns;
import * as ns from "./cls";
export { ns };
import * as ns from "./cls";
export { ns as classContainer };
var ns = require("./cls");
module.exports = {
    ns: ns
};
var ns = require("./cls");
module.exports = ns;
var ns = require("./cls");
module.exports.ns = ns;
var ns = require("./cls");
module.exports.names = ns;
import "./cjs4";
import "./cjs3";
import "./cjs2";
import "./cjs";
import "./bol";
import "./ban";
import "./bat";
import "./baz";
import "./bar";
import "./bar2";
