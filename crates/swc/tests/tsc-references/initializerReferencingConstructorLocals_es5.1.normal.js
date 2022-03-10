import * as swcHelpers from "@swc/helpers";
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
