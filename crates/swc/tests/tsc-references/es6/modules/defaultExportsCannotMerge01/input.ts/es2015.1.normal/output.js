// @filename: m2.ts
import Entity from "m1";
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export default function Decl() {
    return 0;
};
export let Decl;
(function(Decl) {
    Decl.x = 10;
    Decl.y = 20;
})(Decl || (Decl = {
}));
Entity();
var x;
var y;
Entity.x;
Entity.y;
