import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import * as a from "./a";
export var n, C1 = function() {
    "use strict";
    _class_call_check(this, C1);
};
C1.staticProp = 0;
export function F1() {}
F1.staticProp = 0;
export var C2 = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
C2.staticProp = 0;
export var F2 = function() {};
F2.staticProp = 0;
var C3 = function() {
    "use strict";
    _class_call_check(this, C3);
};
function F3() {}
C3.staticProp = 0, F3.staticProp = 0;
var C4 = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
C4.staticProp = 0;
var F4 = function() {};
F4.staticProp = 0, a.C1.staticProp, a.C2.staticProp, a.F1.staticProp, a.F2.staticProp, C3.staticProp, C4.staticProp, F3.staticProp, F4.staticProp;
