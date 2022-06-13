import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
class X {
    constructor(){
        _class_static_private_method_get(X, X, m).call(X);
    }
}
function m() {
    return _class_static_private_method_get({}, X, m).call(X), 1;
}
_class_static_private_method_get(X, X, m).call(X);
