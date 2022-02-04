// @filename: m2.ts
import Entity from "m1";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Decl = function Decl() {
    "use strict";
    _classCallCheck(this, Decl);
};
// @module: commonjs
// @target: ES5
// @filename: m1.ts
export { Decl as default };
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
