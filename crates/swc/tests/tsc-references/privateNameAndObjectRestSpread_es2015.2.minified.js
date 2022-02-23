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
class C {
    method(other) {
        const obj = _objectSpread({}, other);
        _classPrivateFieldGet(obj, _prop);
        const rest = _extends({}, other);
        _classPrivateFieldGet(rest, _prop);
        const statics = _objectSpread({}, C);
        _classStaticPrivateFieldSpecGet(statics, C, _propStatic);
        const sRest = _extends({}, C);
        _classStaticPrivateFieldSpecGet(sRest, C, _propStatic);
    }
    constructor(){
        !function(obj, privateMap, value) {
            !function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            }(obj, privateMap), privateMap.set(obj, value);
        }(this, _prop, {
            writable: !0,
            value: 1
        });
    }
}
var _prop = new WeakMap(), _propStatic = {
    writable: !0,
    value: 1
};
