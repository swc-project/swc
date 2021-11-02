function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @target: esnext
// @useDefineForClassFields: true
// With useDefineForClassFields: true and ESNext target, initializer
// expressions for property declarations are evaluated in the scope of
// the class body and are permitted to reference parameters or local
// variables of the constructor. This is different from classic
// Typescript behaviour, with useDefineForClassFields: false. There,
// initialisers of property declarations are evaluated in the scope of
// the constructor body.
// Note that when class fields are accepted in the ECMAScript
// standard, the target will become that year's ES20xx
var x1 = 1;
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    this.b // ok
     = x;
};
var y1 = 1;
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.b // ok
     = y;
    var y = "";
};
var E = function E(z) {
    "use strict";
    _classCallCheck(this, E);
    this.b // not ok
     = z;
};
