import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: es6
class A1 {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, "");
        swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1, 1) // Error
        ;
        swcHelpers.classStaticPrivateMethodGet(A1, A1, method).call(A1) // Error 
        ;
    }
}
function method(param) {
    return "";
}
