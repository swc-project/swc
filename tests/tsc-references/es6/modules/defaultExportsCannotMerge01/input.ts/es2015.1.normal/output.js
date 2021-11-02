// @filename: m2.ts
import Entity from "m1";
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export default function Decl1() {
    return 0;
};
var Decl1;
export { Decl1 as Decl };
(function(Decl) {
    Decl.x = 10;
    Decl.y = 20;
})(Decl1 || (Decl1 = {
}));
Entity();
var x;
var y;
Entity.x;
Entity.y;
