import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @filename: m2.ts
import Entity from "m1";
var Decl = function Decl() {
    "use strict";
    _class_call_check(this, Decl);
};
export { Decl as default };
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
