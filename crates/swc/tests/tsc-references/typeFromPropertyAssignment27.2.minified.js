//// [a.js]
function C() {
    this.p = 1;
}
C.prototype = {
    q: 2
};
var c = new C();
c.p, c.q;
