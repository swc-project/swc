import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.foo = C // ok
;
var C2 = function C2() {
    "use strict";
    swcHelpers.classCallCheck(this, C2);
};
C2.foo = C2 // ok
;
