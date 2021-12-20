// @filename: m2.ts
import Entity from "m1";
class Decl {
}
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export { Decl as default };
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
