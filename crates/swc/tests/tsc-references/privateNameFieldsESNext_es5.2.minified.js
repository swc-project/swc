function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
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
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _classPrivateFieldInit(this, _a, {
            writable: !0,
            value: 10
        }), _classPrivateFieldInit(this, _b, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldInit(this, _something, {
            writable: !0,
            value: function() {
                return 1234;
            }
        }), this.a = 123, this.c = "hello";
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function() {
                console.log(_classPrivateFieldGet(this, _a)), (function(receiver, privateMap, value) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                    var descriptor = privateMap.get(receiver);
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value;
                })(this, _a, "hello"), console.log(_classPrivateFieldGet(this, _b));
            }
        }
    ], staticProps = [
        {
            key: "test",
            value: function() {
                console.log(function(receiver, classConstructor, descriptor) {
                    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
                    return descriptor.value;
                }(this, C, _m)), console.log(function(receiver, classConstructor, descriptor, value) {
                    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    return descriptor.value = value, value;
                }(this, C, _x, "test"));
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _a = new WeakMap(), _b = new WeakMap(), _m = {
    writable: !0,
    value: "test"
}, _x = {
    writable: !0,
    value: void 0
}, _something = new WeakMap();
