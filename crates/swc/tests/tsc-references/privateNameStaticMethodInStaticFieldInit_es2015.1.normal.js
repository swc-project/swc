import * as swcHelpers from "@swc/helpers";
// @target: es2015
class C {
}
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, method).call(C);
function method() {
    return 42;
}
console.log(C.s);
