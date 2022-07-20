// @module: commonjs
// @target: ES5
// @filename: m1.ts
export default class Decl {
};
// @filename: m2.ts
import Entity from "m1";
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
