import * as swcHelpers from "@swc/helpers";
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
var C = function C(x1) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.a = x // error
    ;
};
var D = function D(x2) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.x = x2;
    this.a = x // error
    ;
};
var E = function E(x) {
    "use strict";
    swcHelpers.classCallCheck(this, E);
    this.x = x;
    this.a = this.x // ok
    ;
};
var F = function F(x3) {
    "use strict";
    swcHelpers.classCallCheck(this, F);
    this.x = x3;
    this.a = this.x // ok
    ;
    this.b = x // error
    ;
};
