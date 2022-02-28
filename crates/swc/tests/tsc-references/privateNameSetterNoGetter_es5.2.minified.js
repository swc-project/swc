function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    var set_x = function(x) {}, _x = new WeakMap(), _class = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function _class() {
            var obj, privateMap, value;
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, _class), obj = this, privateMap = _x, value = {
                get: void 0,
                set: set_x
            }, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap), privateMap.set(obj, value);
        }
        return Constructor = _class, protoProps = [
            {
                key: "m",
                value: function() {
                    var receiver, privateMap, descriptor, receiver, descriptor, receiver, privateMap, value, descriptor;
                    receiver = this, privateMap = _x, receiver = this, value = ((descriptor = descriptor = _classExtractFieldDescriptor(receiver, privateMap = _x, "get")).get ? descriptor.get.call(receiver) : descriptor.value) + 2, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
                        if (descriptor.set) descriptor.set.call(receiver, value);
                        else {
                            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                            descriptor.value = value;
                        }
                    })(receiver, descriptor, value);
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
    }();
    return _class;
}();
console.log(new C().m());
