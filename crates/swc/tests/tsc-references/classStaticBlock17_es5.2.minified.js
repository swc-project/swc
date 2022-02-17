function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var friendA, A = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function A(v) {
        _classCallCheck(this, A), _x.set(this, {
            writable: !0,
            value: void 0
        }), _classPrivateFieldSet(this, _x, v);
    }
    return Constructor = A, protoProps = [
        {
            key: "getX",
            value: function() {
                return _classPrivateFieldGet(this, _x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _x = new WeakMap();
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
