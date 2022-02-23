function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
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
var _method = new WeakSet(), A3 = function(a, b) {
    "use strict";
    var obj, privateSet, receiver, privateMap, descriptor, _b, ref;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A3), obj = this, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateSet = _method), privateSet.add(obj), _classPrivateFieldSet(this, _method, function() {}), _classPrivateFieldSet(a, _method, function() {}), _classPrivateFieldSet(b, _method, function() {}), ref = {
        x: function() {}
    }, (receiver = this, descriptor = _classExtractFieldDescriptor(receiver, privateMap = _method, "set"), (function(receiver, descriptor) {
        if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
            set value (v){
                descriptor.set.call(receiver, v);
            }
        }), descriptor.__destrObj;
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        return descriptor;
    })(receiver, descriptor)).value = ref.x, _classPrivateMethodGet(this, _method, method), _classPrivateFieldSet(_b = b, _method, +_classPrivateMethodGet(_b, _method, method) + 1);
};
function method() {}
