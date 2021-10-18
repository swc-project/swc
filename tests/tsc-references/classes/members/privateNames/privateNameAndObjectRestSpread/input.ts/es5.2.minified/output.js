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
function _defineProperty(obj, key, value) {
    return key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : obj[key] = value, obj;
}
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
var C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _prop.set(this, {
            writable: !0,
            value: 1
        });
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function(other) {
                _classPrivateFieldGet(function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = null != arguments[i] ? arguments[i] : {
                        }, ownKeys = Object.keys(source);
                        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                        }))), ownKeys.forEach(function(key) {
                            _defineProperty(target, key, source[key]);
                        });
                    }
                    return target;
                }({
                }, other), _prop), _classPrivateFieldGet(_extends({
                }, other), _prop);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _prop = new WeakMap();
