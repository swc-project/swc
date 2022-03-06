function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
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
var friendA, _x = new WeakMap(), A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A(v) {
        var obj, privateMap, value;
        _classCallCheck(this, A), obj = this, value = {
            writable: !0,
            value: void 0
        }, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateMap = _x), privateMap.set(obj, value), _classPrivateFieldSet(this, _x, v);
    }
    return Constructor = A, protoProps = [
        {
            key: "getX",
            value: function() {
                return _classPrivateFieldGet(this, _x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}();
friendA = {
    getX: function(obj) {
        return _classPrivateFieldGet(obj, _x);
    },
    setX: function(obj, value) {
        _classPrivateFieldSet(obj, _x, value);
    }
};
var B = function(a1) {
    "use strict";
    _classCallCheck(this, B);
    var x = friendA.getX(a1);
    friendA.setX(a1, x + 1);
}, a = new A(41);
new B(a), a.getX();
