import * as swcHelpers from "@swc/helpers";
// @target: es2015
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, method).call(C);
function method() {
    return 42;
}
console.log(C.s);
