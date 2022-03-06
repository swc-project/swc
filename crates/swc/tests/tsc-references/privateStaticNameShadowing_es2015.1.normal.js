import * as swcHelpers from "@swc/helpers";
// @target: es2015
class X {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
    }
}
var _f = {
    writable: true,
    value: swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X)
};
function m() {
    const X1 = {}; // shadow the class
    const _a = {}; // shadow the first generated var
    swcHelpers.classStaticPrivateMethodGet(X1, X, m).call(X); // Should check with X as the receiver with _b as the class constructor 
    return 1;
}
