//// [inferringClassStaticMembersFromAssignments.ts]
//// [a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
C1.staticProp = 0;
export function F1() {}
F1.staticProp = 0;
export var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
C2.staticProp = 0;
export var F2 = function() {};
F2.staticProp = 0;
//// [global.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
function F3() {}
C3.staticProp = 0, F3.staticProp = 0;
var C4 = function C4() {
    "use strict";
    _class_call_check(this, C4);
};
C4.staticProp = 0;
var F4 = function() {};
F4.staticProp = 0;
//// [b.ts]
import * as a from "./a";
var n, n = a.C1.staticProp, n = a.C2.staticProp, n = a.F1.staticProp, n = a.F2.staticProp, n = C3.staticProp, n = C4.staticProp, n = F3.staticProp, n = F4.staticProp;
