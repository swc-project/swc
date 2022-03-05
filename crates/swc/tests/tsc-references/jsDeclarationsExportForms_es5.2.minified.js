import * as swcHelpers from "@swc/helpers";
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
export var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
export function func() {}
export * from "./cls";
export * from "./func";
export * from "./cls";
export default ns;
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
export { Foo, ns, ns as classContainer };
