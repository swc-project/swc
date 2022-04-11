import * as swcHelpers from "@swc/helpers";
class C {
}
function method() {
    return 42;
}
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, method).call(C), console.log(C.s);
