import * as swcHelpers from "@swc/helpers";
var C = function() {
    swcHelpers.classCallCheck(this, C);
};
C.f1 = 1, console.log(C.f1, C.f2, C.f3), C.f2 = 2, console.log(C.f1, C.f2, C.f3), C.f3 = 3;
