import * as swcHelpers from "@swc/helpers";
var C = function() {
    swcHelpers.classCallCheck(this, C);
};
function method() {
    return 42;
}
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, method).call(C), console.log(C.s);
