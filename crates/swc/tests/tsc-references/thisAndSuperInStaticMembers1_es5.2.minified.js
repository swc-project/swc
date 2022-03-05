function _assertThisInitialized(self) {
    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
var _ref, _super_a, ref, ref1, ref2, ref3, ref4, ref5, ref6, _tmp, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _templateObject() {
    var strings, raw, data = (strings = [
        ""
    ], raw || (raw = strings.slice(0)), Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    })));
    return _templateObject = function _templateObject() {
        return data;
    }, data;
}
var C = function(B) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(C, B);
    var Derived, hasNativeReflectConstruct, _super = (Derived = C, hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }(), function() {
        var self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" === _typeof(call) || "function" == typeof call) ? call : _assertThisInitialized(self);
    });
    function C() {
        var _this;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _this = _super.apply(this, arguments), _this.x = 1, _this.y = _this.x, _this.z = _get((_assertThisInitialized(_this), _getPrototypeOf(C.prototype)), "f", _this).call(_this), _this;
    }
    return C;
}(B);
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z1 = _get(_getPrototypeOf(C), "a", C), C.z2 = _get(_getPrototypeOf(C), "a", C), C.z3 = _get(_getPrototypeOf(C), "f", C).call(C), C.z4 = _get(_getPrototypeOf(C), "f", C).call(C), C.z5 = _set(_getPrototypeOf(C.prototype), "a", 0, C, !0), C.z6 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, !0), C.z7 = void _set(_getPrototypeOf(C.prototype), "a", 0, C, !0), ref = [
    0
], _get(_getPrototypeOf(C), "a", C) = ref[0], C.z8 = ref, ref2 = (ref1 = [
    0
])[0], _get(_getPrototypeOf(C), "a", C) = void 0 === ref2 ? 0 : ref2, C.z9 = ref1, ref3 = [
    0
], _get(_getPrototypeOf(C), "a", C) = ref3.slice(0), C.z10 = ref3, ref4 = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = ref4.x, C.z11 = ref4, ref6 = (ref5 = {
    x: 0
}).x, _get(_getPrototypeOf(C), "a", C) = void 0 === ref6 ? 0 : ref6, C.z12 = ref5, _tmp = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = _extends({}, _tmp), C.z13 = _tmp, C.z14 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, !0), C.z15 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) - 1, C, !0), C.z16 = _set(_getPrototypeOf(C.prototype), _ref = "a", _get(_getPrototypeOf(C), _ref, C) + 1, C, !0), _set(_getPrototypeOf(C.prototype), "a", (_super_a = +_get(_getPrototypeOf(C), "a", C)) + 1, C, !0), C.z17 = _super_a, C.z18 = _get(_getPrototypeOf(C), "a", C)(_templateObject());
