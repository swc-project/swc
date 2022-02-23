function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet), privateSet.add(obj);
}
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
        }(this, C), _classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), _classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        }), _classPrivateMethodInit(this, _calcHello), _classPrivateMethodInit(this, _screamingHello), _classPrivateMethodInit(this, _screamingHello);
    }
    return Constructor = C, protoProps = [
        {
            key: "getWorld",
            value: function() {
                var receiver, privateMap, receiver, descriptor, descriptor;
                return receiver = this, (descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver, privateMap = _world, "get")).get ? descriptor.get.call(receiver) : descriptor.value;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
var _hello = new WeakMap(), _world = new WeakMap();
