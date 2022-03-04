function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
        set = Reflect.set;
    } else {
        set = function set(target, property, value, receiver) {
            var base = _superPropBase(target, property);
            var desc;
            if (base) {
                desc = Object.getOwnPropertyDescriptor(base, property);
                if (desc.set) {
                    desc.set.call(receiver, value);
                    return true;
                } else if (!desc.writable) {
                    return false;
                }
            }
            desc = Object.getOwnPropertyDescriptor(receiver, property);
            if (desc) {
                if (!desc.writable) {
                    return false;
                }
                desc.value = value;
                Object.defineProperty(receiver, property, desc);
            } else {
                _defineProperty(receiver, property, value);
            }
            return true;
        };
    }
    return set(target, property, value, receiver);
}
function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);
    if (!s && isStrict) {
        throw new Error("failed to set property");
    }
    return value;
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
var _ref, _super_a;
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        var _this;
        _this = _super.apply(this, arguments);
        // these should be unaffected
        _this.x = 1;
        _this.y = _this.x;
        _this.z = _get((_assertThisInitialized(_this), _getPrototypeOf(C.prototype)), "f", _this).call(_this);
        return _this;
    }
    return C;
}(B);
C.x = undefined;
C.y1 = C.x;
C.y2 = C.x();
C.y3 = C === null || C === void 0 ? void 0 : C.x();
C.y4 = C["x"]();
C.y5 = C === null || C === void 0 ? void 0 : C["x"]();
C.z1 = _get(_getPrototypeOf(C), "a", C);
C.z2 = _get(_getPrototypeOf(C), "a", C);
C.z3 = _get(_getPrototypeOf(C), "f", C).call(C);
C.z4 = _get(_getPrototypeOf(C), "f", C).call(C);
C.z5 = _set(_getPrototypeOf(C.prototype), "a", 0, C, true);
C.z6 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, true);
C.z7 = (function() {
    _set(_getPrototypeOf(C.prototype), "a", 0, C, true);
})();
var ref;
C.z8 = (ref = [
    0
], _get(_getPrototypeOf(C), "a", C) = ref[0], ref);
var ref1, ref2;
C.z9 = (ref1 = [
    0
], ref2 = ref1[0], _get(_getPrototypeOf(C), "a", C) = ref2 === void 0 ? 0 : ref2, ref1);
var ref3;
C.z10 = (ref3 = [
    0
], _get(_getPrototypeOf(C), "a", C) = ref3.slice(0), ref3);
var ref4;
C.z11 = (ref4 = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = ref4.x, ref4);
var ref5, ref6;
C.z12 = (ref5 = {
    x: 0
}, ref6 = ref5.x, _get(_getPrototypeOf(C), "a", C) = ref6 === void 0 ? 0 : ref6, ref5);
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = _extends({}, _tmp), _tmp);
C.z14 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, true);
C.z15 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) - 1, C, true);
C.z16 = _set(_getPrototypeOf(C.prototype), _ref = "a", _get(_getPrototypeOf(C), _ref, C) + 1, C, true);
C.z17 = (_set(_getPrototypeOf(C.prototype), "a", (_super_a = +_get(_getPrototypeOf(C), "a", C)) + 1, C, true), _super_a);
C.z18 = _get(_getPrototypeOf(C), "a", C)(_templateObject());
