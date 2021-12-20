function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    this.p = 1;
};
// Property assignment does nothing.
// You have to use Object.defineProperty(C, "prototype", { q: 2 })
// and that only works on classes with no superclass.
// (Object.defineProperty isn't recognised as a JS special assignment right now.)
C.prototype = {
    q: 2
};
var c = new C();
c.p;
c.q;
