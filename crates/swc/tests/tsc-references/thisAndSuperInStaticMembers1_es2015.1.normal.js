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
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
}
var _ref, _super_a;
class C extends B {
    constructor(...args){
        super(...args);
        // these should be unaffected
        this.x = 1;
        this.y = this.x;
        this.z = super.f();
    }
}
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
C.z7 = (()=>{
    _set(_getPrototypeOf(C.prototype), "a", 0, C, true);
})();
C.z8 = [_get(_getPrototypeOf(C), "a", C)] = [
    0
];
C.z9 = [_get(_getPrototypeOf(C), "a", C) = 0] = [
    0
];
C.z10 = [..._get(_getPrototypeOf(C), "a", C)] = [
    0
];
C.z11 = { x: _get(_getPrototypeOf(C), "a", C)  } = {
    x: 0
};
C.z12 = { x: _get(_getPrototypeOf(C), "a", C) = 0  } = {
    x: 0
};
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, _get(_getPrototypeOf(C), "a", C) = _extends({}, _tmp), _tmp);
C.z14 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) + 1, C, true);
C.z15 = _set(_getPrototypeOf(C.prototype), "a", _get(_getPrototypeOf(C), "a", C) - 1, C, true);
C.z16 = _set(_getPrototypeOf(C.prototype), _ref = "a", _get(_getPrototypeOf(C), _ref, C) + 1, C, true);
C.z17 = (_set(_getPrototypeOf(C.prototype), "a", (_super_a = +_get(_getPrototypeOf(C), "a", C)) + 1, C, true), _super_a);
C.z18 = _get(_getPrototypeOf(C), "a", C)``;
