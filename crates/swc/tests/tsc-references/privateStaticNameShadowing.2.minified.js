//// [privateStaticNameShadowing.ts]
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
class X {
    constructor(){
        _class_static_private_method_get(X, X, m).call(X);
    }
}
var _f = {
    writable: !0,
    value: _class_static_private_method_get(X, X, m).call(X)
};
function m() {
    return _class_static_private_method_get({}, X, m).call(X), 1;
}
