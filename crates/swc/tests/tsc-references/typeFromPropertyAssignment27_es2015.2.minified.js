function C() {
    this.p = 1;
}
C.prototype = {
    q: 2
};
const c = new C();
c.p, c.q;
