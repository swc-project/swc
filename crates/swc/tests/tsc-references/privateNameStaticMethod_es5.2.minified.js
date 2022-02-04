function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var A1 = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _classStaticPrivateMethodGet(A1, A1, method).call(A1, ""), _classStaticPrivateMethodGet(A1, A1, method).call(A1, 1), _classStaticPrivateMethodGet(A1, A1, method).call(A1);
};
function method(param) {
    return "";
}
