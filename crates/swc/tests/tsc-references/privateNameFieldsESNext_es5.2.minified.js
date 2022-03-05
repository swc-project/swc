function _classApplyDescriptorGet(receiver, descriptor) {
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) descriptor.set.call(receiver, value);
    else {
        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
        descriptor.value = value;
    }
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var _a = new WeakMap(), _b = new WeakMap(), _something = new WeakMap(), C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), this.a = 123, _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), this.c = "hello", _classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _something, {
            writable: !0,
            value: function() {
                return 1234;
            }
        });
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function() {
                var receiver, privateMap, value, descriptor;
                console.log(_classPrivateFieldGet(this, _a)), receiver = this, value = "hello", descriptor = _classExtractFieldDescriptor(receiver, privateMap = _a, "set"), _classApplyDescriptorSet(receiver, descriptor, value), console.log(_classPrivateFieldGet(this, _b));
            }
        }
    ], staticProps = [
        {
            key: "test",
            value: function() {
                var receiver, classConstructor, descriptor, receiver, classConstructor, descriptor, value;
                console.log((receiver = this, classConstructor = C, descriptor = _m, _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), _classApplyDescriptorGet(receiver, descriptor))), console.log((receiver = this, classConstructor = C, descriptor = _x, value = "test", _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), _classApplyDescriptorSet(receiver, descriptor, value), value));
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
};
