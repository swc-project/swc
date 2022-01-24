function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj1) {
    "@swc/helpers - typeof";
    return obj1 && typeof Symbol !== "undefined" && obj1.constructor === Symbol ? "symbol" : typeof obj1;
};
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
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
var _obj, _obj1, _obj2, _obj3, _instance, _obj4, _instance1, _instance2, _instance3;
function foo(x, y) {
    for(var _len = arguments.length, z1 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        z1[_key - 2] = arguments[_key];
    }
}
var a;
var z;
var obj;
var xa;
foo(1, 2, "abc");
foo.apply(void 0, [
    1,
    2
].concat(_toConsumableArray(a)));
foo.apply(void 0, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
(_obj = obj).foo.apply(_obj, [
    1,
    2
].concat(_toConsumableArray(a)));
(_obj1 = obj).foo.apply(_obj1, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
(_obj2 = obj).foo.apply(_obj2, [
    1,
    2
].concat(_toConsumableArray(a))).foo(1, 2, "abc");
(_instance = (_obj3 = obj).foo.apply(_obj3, [
    1,
    2
].concat(_toConsumableArray(a)))).foo.apply(_instance, [
    1,
    2
].concat(_toConsumableArray(a)));
(_instance1 = (_obj4 = obj).foo.apply(_obj4, [
    1,
    2
].concat(_toConsumableArray(a)))).foo.apply(_instance1, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
obj.foo(1, 2, "abc");
obj.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a)));
obj.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
obj.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo(1, 2, "abc");
obj.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a)));
obj.foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a))).foo.apply(this, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
xa[1].foo(1, 2, "abc");
(_instance2 = xa[1]).foo.apply(_instance2, [
    1,
    2
].concat(_toConsumableArray(a)));
(_instance3 = xa[1]).foo.apply(_instance3, [
    1,
    2
].concat(_toConsumableArray(a), [
    "abc"
]));
xa[1].foo.apply(this, [
    1,
    2,
    "abc"
]);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x, y) {
        for(var _len = arguments.length, z2 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            z2[_key - 2] = arguments[_key];
        }
        _classCallCheck(this, C);
        this.foo(x, y);
        this.foo.apply(this, [
            x,
            y
        ].concat(_toConsumableArray(z2)));
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(x, y) {
                for(var _len = arguments.length, z3 = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
                    z3[_key - 2] = arguments[_key];
                }
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _createSuper(D);
    function D() {
        _classCallCheck(this, D);
        return _super.call(this, 1, 2);
        return _super.call.apply(_super, [
            this,
            1,
            2
        ].concat(_toConsumableArray(a)));
    }
    _createClass(D, [
        {
            key: "foo",
            value: function foo() {
                var _instance4;
                _get(_getPrototypeOf(D.prototype), "foo", this).call(this, 1, 2);
                (_instance4 = _get(_getPrototypeOf(D.prototype), "foo", this)).call.apply(_instance4, [
                    this,
                    1,
                    2
                ].concat(_toConsumableArray(a)));
            }
        }
    ]);
    return D;
}(C);
