function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return privateMap.get(receiver).value;
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
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
        _prop.set(this, {
            writable: !0,
            value: 1
        });
    }
}
var _prop = new WeakMap(), _propStatic = {
    writable: !0,
    value: 1
};
