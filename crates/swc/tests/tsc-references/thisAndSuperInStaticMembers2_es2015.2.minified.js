var _ref, _super_a, _tmp;
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function set(target, property, value, receiver) {
    return set = "undefined" != typeof Reflect && Reflect.set ? Reflect.set : function set(target, property, value, receiver) {
        var obj, key, value, desc, base = _superPropBase(target, property);
        if (base) {
            if ((desc = Object.getOwnPropertyDescriptor(base, property)).set) return desc.set.call(receiver, value), !0;
            if (!desc.writable) return !1;
        }
        if (desc = Object.getOwnPropertyDescriptor(receiver, property)) {
            if (!desc.writable) return !1;
            desc.value = value, Object.defineProperty(receiver, property, desc);
        } else obj = receiver, (key = property) in obj ? Object.defineProperty(obj, key, {
            value: value,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : obj[key] = value;
        return !0;
    }, set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    if (!set(target, property, value, receiver || target) && isStrict) throw new Error("failed to set property");
    return value;
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
class C extends B {
    constructor(...args){
        super(...args), this.x = 1, this.y = this.x, this.z = super.f();
    }
}
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z1 = _get(_getPrototypeOf(C), "a", C), C.z2 = _get(_getPrototypeOf(C), "a", C), C.z3 = _get(_getPrototypeOf(C), "f", C).call(C), C.z4 = _get(_getPrototypeOf(C), "f", C).call(C), C.z5 = _set(_getPrototypeOf(C.prototype), "a", 0, C, !0), C.z6 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, !0), C.z7 = void _set(_getPrototypeOf(C.prototype), "a", 0, C, !0), C.z8 = [_get(_getPrototypeOf(C), "a", C)] = [
    0
], C.z9 = [_get(_getPrototypeOf(C), "a", C) = 0] = [
    0
], C.z10 = [..._get(_getPrototypeOf(C), "a", C)] = [
    0
], C.z11 = { x: _get(_getPrototypeOf(C), "a", C)  } = {
    x: 0
}, C.z12 = { x: _get(_getPrototypeOf(C), "a", C) = 0  } = {
    x: 0
}, _tmp = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = _extends({}, _tmp), C.z13 = _tmp, C.z14 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, !0), C.z15 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) - 1, C, !0), C.z16 = _set(_getPrototypeOf(C.prototype), _ref = "a", _get(_getPrototypeOf(C), _ref, C) + 1, C, !0), _set(_getPrototypeOf(C.prototype), "a", (_super_a = +_get(_getPrototypeOf(C), "a", C)) + 1, C, !0), C.z17 = _super_a, C.z18 = _get(_getPrototypeOf(C), "a", C)``;
