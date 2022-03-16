import * as swcHelpers from "@swc/helpers";
// Each of these types has an error in it. 
// String named and numeric named properties conflict if they would be equivalent after ToNumber on the property name.
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
var a;
var b = {
    "0": '',
    0: ''
};
