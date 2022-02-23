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
        var obj, privateMap, value;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), obj = this, value = {
            writable: !0,
            value: void 0
        }, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateMap = _x), privateMap.set(obj, value);
    }
    return Constructor = C, protoProps = null, staticProps = [
        {
            key: "test",
            value: function() {
                var receiver, privateMap, value, descriptor;
                value = 10, descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver = new C(), privateMap = _x, "set"), (function(receiver, descriptor, value) {
                    if (descriptor.set) descriptor.set.call(receiver, value);
                    else {
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        descriptor.value = value;
                    }
                })(receiver, descriptor, value), new new C()().x = 123;
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _x = new WeakMap();
