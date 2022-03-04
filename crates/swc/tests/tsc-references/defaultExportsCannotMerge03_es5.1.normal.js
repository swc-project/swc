function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: m2.ts
import Entity from "m1";
var Decl = function Decl() {
    "use strict";
    _classCallCheck(this, Decl);
};
export { Decl as default };
Entity();
var x;
var y;
var z = new Entity();
var sum = z.p1 + z.p2;
