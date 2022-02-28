var Generic;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
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
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
!function(Generic) {
    var C = function() {
        "use strict";
        function C() {
            _classCallCheck(this, C);
        }
        return _createClass(C, [
            {
                key: "y",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }(), c = new C();
    c.y = c.y;
    var _value = new WeakMap(), Box = function() {
        "use strict";
        function Box() {
            var obj, privateMap, value1;
            _classCallCheck(this, Box), obj = this, value1 = {
                writable: !0,
                value: void 0
            }, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap = _value), privateMap.set(obj, value1);
        }
        return _createClass(Box, [
            {
                key: "value",
                get: function() {
                    var receiver, privateMap, descriptor, receiver, descriptor;
                    return receiver = this, (descriptor = _classExtractFieldDescriptor(receiver, privateMap = _value, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
                },
                set: function(value) {
                    var receiver, privateMap, value1, descriptor;
                    receiver = this, privateMap = _value, value1 = value, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"), (function(receiver, descriptor, value1) {
                        if (descriptor.set) descriptor.set.call(receiver, value1);
                        else {
                            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                            descriptor.value = value1;
                        }
                    })(receiver, descriptor, value1);
                }
            }
        ]), Box;
    }();
    new Box().value = 3;
}(Generic || (Generic = {}));
