function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldGet(receiver, privateMap) {
    var receiver, descriptor, descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldInit(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap), privateMap.set(obj, value);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _hello = new WeakMap(), _world = new WeakMap(), _calcHello = new WeakSet(), _screamingHello = new WeakMap();
export var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        var obj, privateSet;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), obj = this, _checkPrivateRedeclaration(obj, privateSet = _calcHello), privateSet.add(obj), _classPrivateFieldInit(this, _screamingHello, {
            get: get_screamingHello,
            set: set_screamingHello
        }), _classPrivateFieldInit(this, _hello, {
            writable: !0,
            value: "hello"
        }), _classPrivateFieldInit(this, _world, {
            writable: !0,
            value: 100
        });
    }
    return Constructor = C, protoProps = [
        {
            key: "getWorld",
            value: function() {
                return _classPrivateFieldGet(this, _world);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}();
function get_screamingHello() {
    return _classPrivateFieldGet(this, _hello).toUpperCase();
}
function set_screamingHello(value) {
    throw "NO";
}
