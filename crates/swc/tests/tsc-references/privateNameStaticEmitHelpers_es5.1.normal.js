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
// @target: es2015
// @importHelpers: true
// @isolatedModules: true
// @filename: main.ts
export var S = function S() {
    "use strict";
    _classCallCheck(this, S);
};
var _a = {
    writable: true,
    value: 1
};
function b() {
    _classStaticPrivateFieldSpecSet(this, S, _a, 42);
}
function c() {
    return _classStaticPrivateMethodGet(S, S, b).call(S);
}
