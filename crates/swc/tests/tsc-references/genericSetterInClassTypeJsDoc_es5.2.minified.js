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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Box = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Box(initialValue) {
        var obj, privateMap, value;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Box), obj = this, value = {
            writable: !0,
            value: void 0
        }, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateMap = _value), privateMap.set(obj, value), _classPrivateFieldSet(this, _value, initialValue);
    }
    return Constructor = Box, protoProps = [
        {
            key: "value",
            get: function() {
                var receiver, privateMap, descriptor, receiver, descriptor;
                return receiver = this, (descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _value, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
            },
            set: function(value) {
                _classPrivateFieldSet(this, _value, value);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Box;
}(), _value = new WeakMap();
new Box(3).value = 3;
