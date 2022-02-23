function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "set");
    return !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateSet), privateSet.add(obj);
}
var _prop = new WeakSet(), _prop = new WeakSet(), _roProp = new WeakSet(), A1 = function(name) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A1), _classPrivateMethodInit(this, _prop), _classPrivateMethodInit(this, _prop), _classPrivateMethodInit(this, _roProp), _classPrivateFieldSet(this, _prop, ""), _classPrivateFieldSet(this, _roProp, ""), console.log(_classPrivateMethodGet(this, _prop, prop)), console.log(_classPrivateMethodGet(this, _roProp, roProp));
};
function prop() {
    return "";
}
function prop(param) {}
function roProp() {
    return "";
}
