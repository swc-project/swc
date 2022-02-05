function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var A1 = function A1(name) {
    "use strict";
    _classCallCheck(this, A1);
    _classStaticPrivateFieldSpecSet(A1, A1, _prop, "");
    _classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""); // Error
    console.log(_classStaticPrivateMethodGet(A1, A1, prop));
    console.log(_classStaticPrivateMethodGet(A1, A1, roProp));
};
function prop() {
    return "";
}
function prop(param) {}
function roProp() {
    return "";
}
