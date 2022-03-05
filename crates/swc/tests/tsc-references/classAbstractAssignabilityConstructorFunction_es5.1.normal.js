import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
// var AA: typeof A;
var AAA;
// AA = A; // okay
AAA = A; // error. 
AAA = "asdf";
