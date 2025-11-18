//// [constructSignaturesWithOverloads2.ts]
// No errors expected for basic overloads of construct signatures with merged declarations
// clodules
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
(function(C) {
    C.x = 1;
})(C || (C = {}));
var r1 = new C(1, '');
var C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2);
};
(function(C2) {
    C2.x = 1;
})(C2 || (C2 = {}));
var r2 = new C2(1, '');
var i2;
var r4 = new i2(1, '');
var r5 = new i2(1, 1);
