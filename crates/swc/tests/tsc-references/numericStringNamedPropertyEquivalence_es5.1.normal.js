import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Each of these types has an error in it. 
// String named and numeric named properties conflict if they would be equivalent after ToNumber on the property name.
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b = {
    "0": "",
    0: ""
};
