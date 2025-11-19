//// [functionLiteralForOverloads2.ts]
// basic uses of function literals with constructor overloads
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
};
var f = C;
var f2 = C;
var f3 = D;
