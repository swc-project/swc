function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor 
// body but are not permitted to reference parameters or local variables of the constructor.
// This effectively means that entities from outer scopes by the same name as a constructor parameter or 
// local variable are inaccessible in initializer expressions for instance member variables
var x1 = 1;
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    this.b // error, evaluated in scope of constructor, cannot reference x
     = x;
    x = 2; // error, x is string
};
var y1 = 1;
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.b // error, evaluated in scope of constructor, cannot reference y
     = y;
    var y = "";
};
