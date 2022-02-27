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
var _superprop_set_a = (_value)=>super.a = _value
;
function _templateObject() {
    var data = _taggedTemplateLiteral([
        ""
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
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
C.z1 = super.a;
C.z2 = super["a"];
C.z3 = super.f();
C.z4 = super["f"]();
C.z5 = super.a = 0;
C.z6 = super.a += 1;
C.z7 = (function() {
    _superprop_set_a(0);
})();
var ref;
C.z8 = (ref = [
    0
], super.a = ref[0], ref);
var ref1, ref2;
C.z9 = (ref1 = [
    0
], ref2 = ref1[0], super.a = ref2 === void 0 ? 0 : ref2, ref1);
var ref3;
C.z10 = (ref3 = [
    0
], super.a = ref3.slice(0), ref3);
var ref4;
C.z11 = (ref4 = {
    x: 0
}, super.a = ref4.x, ref4);
var ref5, ref6;
C.z12 = (ref5 = {
    x: 0
}, ref6 = ref5.x, super.a = ref6 === void 0 ? 0 : ref6, ref5);
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, super.a = _extends({}, _tmp), _tmp);
C.z14 = ++super.a;
C.z15 = --super.a;
C.z16 = ++super["a"];
C.z17 = super.a++;
C.z18 = super.a(_templateObject());
