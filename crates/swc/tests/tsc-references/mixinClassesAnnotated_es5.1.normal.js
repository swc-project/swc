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
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
function _createSuper(Derived1) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived1), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var Base = function Base(x, y) {
    "use strict";
    _classCallCheck(this, Base);
    this.x = x;
    this.y = y;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _createSuper(Derived);
    function Derived(x, y, z) {
        _classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, x, y);
        _this.z = z;
        return _this;
    }
    return Derived;
}(Base);
var Printable = function(superClass1) {
    var _class = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(_class, superClass);
        var _super = _createSuper(_class);
        function _class() {
            _classCallCheck(this, _class);
            return _super.apply(this, arguments);
        }
        _createClass(_class, [
            {
                key: "print",
                value: function print() {
                    var output = this.x + "," + this.y;
                }
            }
        ]);
        return _class;
    }(superClass1);
    _class.message = "hello";
    return _class;
};
function Tagged(superClass2) {
    var C = /*#__PURE__*/ function(superClass) {
        "use strict";
        _inherits(C, superClass);
        var _super = _createSuper(C);
        function C() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            _classCallCheck(this, C);
            var _this;
            _this = _super.call.apply(_super, [
                this
            ].concat(_toConsumableArray(args)));
            _this._tag = "hello";
            return _this;
        }
        return C;
    }(superClass2);
    return C;
}
var Thing1 = Tagged(Derived);
var Thing2 = Tagged(Printable(Derived));
Thing2.message;
function f1() {
    var thing = new Thing1(1, 2, 3);
    thing.x;
    thing._tag;
}
function f2() {
    var thing = new Thing2(1, 2, 3);
    thing.x;
    thing._tag;
    thing.print();
}
var Thing3 = /*#__PURE__*/ function(Thing21) {
    "use strict";
    _inherits(Thing3, Thing21);
    var _super = _createSuper(Thing3);
    function Thing3(tag) {
        _classCallCheck(this, Thing3);
        var _this;
        _this = _super.call(this, 10, 20, 30);
        _this._tag = tag;
        return _this;
    }
    _createClass(Thing3, [
        {
            key: "test",
            value: function test() {
                this.print();
            }
        }
    ]);
    return Thing3;
}(Thing2);
