import * as swcHelpers from "@swc/helpers";
// These are all errors because type parameters cannot reference other type parameters from the same list
function foo(x, y) {
    foo(y, y);
    return new C();
}
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
