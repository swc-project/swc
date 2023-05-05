//// [assignmentCompatWithObjectMembers5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var i;
c = i; // error
i = c; // error
