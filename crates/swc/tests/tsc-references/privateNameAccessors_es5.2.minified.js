function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
var _prop = new WeakSet(), _prop = new WeakSet(), _roProp = new WeakSet(), A1 = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _prop.add(this), _prop.add(this), _roProp.add(this), _classPrivateFieldSet(this, _prop, ""), _classPrivateFieldSet(this, _roProp, ""), console.log(_classPrivateMethodGet(this, _prop, prop)), console.log(_classPrivateMethodGet(this, _roProp, roProp));
};
function prop() {
    return "";
}
function prop(param) {}
function roProp() {
    return "";
}
