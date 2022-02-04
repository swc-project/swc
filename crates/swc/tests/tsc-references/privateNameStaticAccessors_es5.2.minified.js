function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var A1 = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _classStaticPrivateFieldSpecSet(A1, A1, _prop, ""), _classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""), console.log(_classStaticPrivateMethodGet(A1, A1, prop)), console.log(_classStaticPrivateMethodGet(A1, A1, roProp));
};
function prop() {
    return "";
}
function prop(param) {}
function roProp() {
    return "";
}
