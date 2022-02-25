function _classApplyDescriptorGet(receiver, descriptor) {
    return descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = function(receiver, privateMap, action) {
        if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
        return privateMap.get(receiver);
    }(receiver, privateMap, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), !function(descriptor, action) {
        if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
    }(descriptor, "get"), _classApplyDescriptorGet(receiver, descriptor);
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
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {}, ownKeys = Object.keys(source);
        "function" == typeof Object.getOwnPropertySymbols && (ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }))), ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
var _prop = new WeakMap(), C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        var obj, privateMap, value;
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), obj = this, value = {
            writable: !0,
            value: 1
        }, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateMap = _prop), privateMap.set(obj, value);
    }
    return Constructor = C, protoProps = [
        {
            key: "method",
            value: function(other) {
                _classPrivateFieldGet(_objectSpread({}, other), _prop), _classPrivateFieldGet(_extends({}, other), _prop), _classStaticPrivateFieldSpecGet(_objectSpread({}, C), C, _propStatic), _classStaticPrivateFieldSpecGet(_extends({}, C), C, _propStatic);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), _propStatic = {
    writable: !0,
    value: 1
};
