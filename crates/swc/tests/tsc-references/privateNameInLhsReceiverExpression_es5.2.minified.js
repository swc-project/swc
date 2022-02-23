function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldInit(obj, privateMap, value) {
    !function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    }(obj, privateMap), privateMap.set(obj, value);
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
var Test = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Test() {
        _classCallCheck(this, Test), _classPrivateFieldInit(this, _y, {
            writable: !0,
            value: 123
        });
    }
    return Constructor = Test, protoProps = null, staticProps = [
        {
            key: "something",
            value: function(obj) {
                var _s, _class, _x, _class1, _x1, receiver, privateMap, descriptor, receiver, descriptor;
                _classPrivateFieldSet(obj[(new (_class = function() {
                    _classCallCheck(this, _class), _classPrivateFieldInit(this, _x, {
                        writable: !0,
                        value: 1
                    }), this.s = "prop";
                }, _x = new WeakMap(), _class)).s], _y, 1), _classPrivateFieldSet(_s = obj[(new (_class1 = function() {
                    _classCallCheck(this, _class1), _classPrivateFieldInit(this, _x1, {
                        writable: !0,
                        value: 1
                    }), this.s = "prop";
                }, _x1 = new WeakMap(), _class1)).s], _y, ((descriptor = descriptor = _classExtractFieldDescriptor(receiver = _s, privateMap = _y, "get")).get ? descriptor.get.call(receiver) : descriptor.value) + 1);
            }
        }
    ], protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Test;
}(), _y = new WeakMap();
