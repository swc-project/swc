function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _calcHello = new WeakSet(), _screamingHello = new WeakSet(), _screamingHello = new WeakSet();
export var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _hello.set(this, {
            writable: !0,
            value: "hello"
        }), _world.set(this, {
            writable: !0,
            value: 100
        }), _calcHello.add(this), _screamingHello.add(this), _screamingHello.add(this);
    }
    return Constructor = C, protoProps = [
        {
            key: "getWorld",
            value: function() {
                return (function(receiver, privateMap) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver).value;
                })(this, _world);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
var _hello = new WeakMap(), _world = new WeakMap();
