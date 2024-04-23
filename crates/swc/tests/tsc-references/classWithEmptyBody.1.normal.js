//// [classWithEmptyBody.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var o = c;
c = 1;
c = {
    foo: ''
};
c = function() {};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    return 1;
};
var d;
var o = d;
d = 1;
d = {
    foo: ''
};
d = function() {};
