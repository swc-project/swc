//// [multipleNumericIndexers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Multiple indexers of the same type are an error
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b = {
    1: '',
    "2": ''
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
