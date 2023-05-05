//// [a.js]
/** @param {number} x */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function C(x) {
    this.x = x;
}
C.prototype.m = function() {
    this.y = 12;
};
var c = new C(1);
c.x = undefined // should error
;
c.y = undefined // ok
;
/** @param {number} x */ function A(x) {
    if (!_instanceof(this, A)) {
        return new A(x);
    }
    this.x = x;
}
var k = A(1);
var j = new A(2);
k.x === j.x;
