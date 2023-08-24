//// [a.js]
/** @param {number} x */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function C(x) {
    this.x = x;
}
C.prototype.m = function() {
    this.y = 12;
};
var c = new C(1);
/** @param {number} x */ function A(x) {
    if (!_instanceof(this, A)) return new A(x);
    this.x = x;
}
c.x = void 0 // should error
, c.y = void 0 // ok
;
var k = A(1), j = new A(2);
k.x, j.x;
