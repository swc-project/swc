import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
var x = 1;
var C = function C(x1) {
    "use strict";
    _class_call_check(this, C);
    this.b = x // ok
    ;
};
var y = 1;
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
    this.b = y // ok
    ;
    var y1 = "";
};
var E = function E(z1) {
    "use strict";
    _class_call_check(this, E);
    this.b = z // not ok
    ;
};
