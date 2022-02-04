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
     = z;
    this.c // error
     = this.z;
    z = 1;
};
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.a // error
     = z;
    this.c // error
     = this.z;
    z = 1;
};
