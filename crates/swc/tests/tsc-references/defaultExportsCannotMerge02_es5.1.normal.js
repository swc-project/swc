import * as swcHelpers from "@swc/helpers";
// @filename: m2.ts
import Entity from "m1";
var Decl = function Decl() {
    "use strict";
    swcHelpers.classCallCheck(this, Decl);
};
export { Decl as default };
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
