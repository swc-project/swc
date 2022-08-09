// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: cls.js
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
// @filename: func.js
export function func() {}
// @filename: bar.js
export * from "./cls";
// @filename: bar2.js
export * from "./func";
export * from "./cls";
// @filename: baz.js
import { Foo } from "./cls";
export { Foo };
// @filename: bat.js
import * as ns from "./cls";
export default ns;
// @filename: ban.js
import * as ns from "./cls";
export { ns };
// @filename: bol.js
import * as ns from "./cls";
export { ns as classContainer };
// @filename: cjs.js
var ns = require("./cls");
module.exports = {
    ns: ns
};
// @filename: cjs2.js
var ns = require("./cls");
module.exports = ns;
// @filename: cjs3.js
var ns = require("./cls");
module.exports.ns = ns;
// @filename: cjs4.js
var ns = require("./cls");
module.exports.names = ns;
// @filename: includeAll.js
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
