function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
        }), (function(receiver, privateMap, value) {
            if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
            var descriptor = privateMap.get(receiver);
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        })(this, _x, v);
    }
    return Constructor = A, protoProps = [
        {
            key: "getX",
            value: function() {
                return (function(receiver, privateMap) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver).value;
                })(this, _x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), A;
}(), _x = new WeakMap();
friendA = {
    getX: function(obj) {
        return obj.#x;
    },
    setX: function(obj, value) {
        obj.#x = value;
    }
};
var B = function(a1) {
    "use strict";
    _classCallCheck(this, B);
    var x = friendA.getX(a1);
    friendA.setX(a1, x + 1);
}, a = new A(41);
new B(a), a.getX();
