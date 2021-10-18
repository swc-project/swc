function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    // Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
    this.a // error
     = x;
};
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.x = x;
    this.a // error
     = x;
};
var E = function E(x) {
    "use strict";
    _classCallCheck(this, E);
    this.x = x;
    this.a // ok
     = this.x;
};
var F = function F(x) {
    "use strict";
    _classCallCheck(this, F);
    this.x = x;
    this.a // ok
     = this.x;
    this.b // error
     = x;
};
