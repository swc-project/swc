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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
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
var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, _tmp, C = function(B) {
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
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : _assertThisInitialized(self);
    });
    function C() {
        var _this;
        return !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C), _this = _super.apply(this, arguments), _this.x = 1, _this.y = _this.x, _this.z = _get((_assertThisInitialized(_this), _getPrototypeOf(C.prototype)), "f", _this).call(_this), _this;
    }
    return C;
}(B);
C.x = void 0, C.y1 = this.x, C.y2 = this.x(), C.y3 = null === (ref = this) || void 0 === ref ? void 0 : ref.x(), C.y4 = this.x(), C.y5 = null === (ref1 = this) || void 0 === ref1 ? void 0 : ref1.x(), C.z1 = super.a, C.z2 = super.a, C.z3 = super.f(), C.z4 = super.f(), C.z5 = super.a = 0, C.z6 = super.a += 1, C.z7 = void (super.a = 0), ref2 = [
    0
], super.a = ref2[0], C.z8 = ref2, ref4 = (ref3 = [
    0
])[0], super.a = void 0 === ref4 ? 0 : ref4, C.z9 = ref3, ref5 = [
    0
], super.a = ref5.slice(0), C.z10 = ref5, ref6 = {
    x: 0
}, super.a = ref6.x, C.z11 = ref6, ref8 = (ref7 = {
    x: 0
}).x, super.a = void 0 === ref8 ? 0 : ref8, C.z12 = ref7, _tmp = {
    x: 0
}, super.a = _extends({}, _tmp), C.z13 = _tmp, C.z14 = ++super.a, C.z15 = --super.a, C.z16 = ++super.a, C.z17 = super.a++, C.z18 = super.a(_templateObject());
