import * as swcHelpers from "@swc/helpers";
var _ref, _method = new WeakSet();
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    swcHelpers.classPrivateMethodInit(this, _method);
};
C.s = swcHelpers.classPrivateMethodGet(_ref = new C(), _method, method).call(_ref);
function method() {
    return 42;
}
console.log(C.s);
