import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @filename: b.ts
import * as a from "./a";
// @noEmit: true
// @allowJs: true
// @filename: a.js
export var C1 = function C1() {
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
export var F2 = function F2() {};
F2.staticProp = 0;
//@filename: global.js
var C3 = function C3() {
    "use strict";
    _class_call_check(this, C3);
};
C3.staticProp = 0;
function F3() {}
F3.staticProp = 0;
var C4 = function _class() {
    "use strict";
    _class_call_check(this, _class);
};
C4.staticProp = 0;
var F4 = function F4() {};
F4.staticProp = 0;
var n;
var n = a.C1.staticProp;
var n = a.C2.staticProp;
var n = a.F1.staticProp;
var n = a.F2.staticProp;
var n = C3.staticProp;
var n = C4.staticProp;
var n = F3.staticProp;
var n = F4.staticProp;
