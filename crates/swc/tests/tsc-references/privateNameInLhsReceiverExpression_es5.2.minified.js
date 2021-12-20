function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
var Test = function() {
    "use strict";
    var Constructor;
    function Test() {
        _classCallCheck(this, Test), _y.set(this, {
            writable: !0,
            value: 123
        });
    }
    return (function(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
        }
    })(Constructor = Test, [
        {
            key: "something",
            value: function(obj) {
                var _s, _class, _x, _class1, _x1;
                _classPrivateFieldSet(obj[(new (_class = function() {
                    _classCallCheck(this, _class), _x.set(this, {
                        writable: !0,
                        value: 1
                    }), this.s = "prop";
                }, _x = new WeakMap(), _class)).s], _y, 1), _classPrivateFieldSet(_s = obj[(new (_class1 = function() {
                    _classCallCheck(this, _class1), _x1.set(this, {
                        writable: !0,
                        value: 1
                    }), this.s = "prop";
                }, _x1 = new WeakMap(), _class1)).s], _y, function(receiver, privateMap) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver).value;
                }(_s, _y) + 1);
            }
        }
    ]), Test;
}(), _y = new WeakMap();
