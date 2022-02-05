function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var A1 = function A1() {
    "use strict";
    _classCallCheck(this, A1);
    _classStaticPrivateMethodGet(A1, A1, method).call(A1, "");
    _classStaticPrivateMethodGet(A1, A1, method).call(A1, 1) // Error
    ;
    _classStaticPrivateMethodGet(A1, A1, method).call(A1) // Error 
    ;
};
function method(param) {
    return "";
}
