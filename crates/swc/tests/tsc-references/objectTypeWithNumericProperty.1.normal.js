//// [objectTypeWithNumericProperty.ts]
// no errors here
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var r1 = c[1];
var r2 = c[1.1];
var r3 = c['1'];
var r4 = c['1.1'];
var i;
var r1 = i[1];
var r2 = i[1.1];
var r3 = i['1'];
var r4 = i['1.1'];
var a;
var r1 = a[1];
var r2 = a[1.1];
var r3 = a['1'];
var r4 = a['1.1'];
var b = {
    1: 1,
    1.1: ""
};
var r1 = b[1];
var r2 = b[1.1];
var r3 = b['1'];
var r4 = b['1.1'];
