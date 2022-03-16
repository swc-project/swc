import * as swcHelpers from "@swc/helpers";
class C {
}
C.s = swcHelpers.classStaticPrivateMethodGet(C, C, function() {
    return 42;
}).call(C), console.log(C.s);
