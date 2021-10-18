function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var D = function() {
    "use strict";
    _classCallCheck(this, D);
}, C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        _classCallCheck(this, C), _x.set(this, {
            writable: !0,
            value: void 0
        });
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function() {
                _classPrivateFieldGet(new C(), _x), _classPrivateFieldGet(new C(), _x);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _x = new WeakMap();
