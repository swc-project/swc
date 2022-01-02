// @filename: m2.ts
import Entity from "m1";
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export default function Decl() {
    return 0;
};
export var Decl;
(function(Decl1) {
    var x = Decl1.x = 10;
    var y = Decl1.y = 20;
})(Decl || (Decl = {}));
Entity();
var x;
var y;
Entity.x;
Entity.y;
