import * as swcHelpers from "@swc/helpers";
class A1 {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, ""), swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, 1), swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1);
    }
}
function method(param) {
    return "";
}
