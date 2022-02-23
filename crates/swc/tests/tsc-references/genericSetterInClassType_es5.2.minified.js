var Generic;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
    var Box = function() {
        "use strict";
        function Box() {
            var obj, privateMap, value;
            _classCallCheck(this, Box), obj = this, value = {
                writable: !0,
                value: void 0
            }, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateMap = _value), privateMap.set(obj, value);
        }
        return _createClass(Box, [
            {
                key: "value",
                get: function() {
                    return (function(receiver, privateMap) {
                        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                        return privateMap.get(receiver).value;
                    })(this, _value);
                },
                set: function(value1) {
                    !function(receiver, privateMap, value) {
                        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                        var descriptor = privateMap.get(receiver);
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        return descriptor.value = value, value;
                    }(this, _value, value1);
                }
            }
        ]), Box;
    }(), _value = new WeakMap();
    new Box().value = 3;
}(Generic || (Generic = {}));
