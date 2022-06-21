import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @target: es2015
class X {
    constructor(){
        _class_static_private_method_get(X, X, m).call(X);
    }
}
var _f = {
    writable: true,
    value: _class_static_private_method_get(X, X, m).call(X)
};
function m() {
    const X1 = {}; // shadow the class
    const _a = {}; // shadow the first generated var
    _class_static_private_method_get(X1, X, m).call(X); // Should check with X as the receiver with _b as the class constructor 
    return 1;
}
