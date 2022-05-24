import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
var C = function C(x1) {
    "use strict";
    _class_call_check(this, C);
    this.a = x // error
    ;
};
var D = function D(x2) {
    "use strict";
    _class_call_check(this, D);
    this.x = x2;
    this.a = x;
};
var E = function E(x) {
    "use strict";
    _class_call_check(this, E);
    this.x = x;
    this.a = this.x;
};
var F = function F(x3) {
    "use strict";
    _class_call_check(this, F);
    this.x = x3;
    this.a = this.x;
    this.b = x;
};
