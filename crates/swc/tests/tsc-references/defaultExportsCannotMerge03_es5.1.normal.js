// @module: commonjs
// @target: ES5
// @filename: m1.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Decl = function Decl() {
    "use strict";
    _class_call_check(this, Decl);
};
export { Decl as default };
// @filename: m2.ts
import Entity from "m1";
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
