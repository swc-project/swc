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
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
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
var BaseA = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function BaseA(x) {
        _classCallCheck(this, BaseA);
        this.x = x;
    }
    _createClass(BaseA, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseA(1);
            }
        }
    ]);
    return BaseA;
}();
var BaseB = /*#__PURE__*/ function() {
    "use strict";
    function BaseB(x) {
        _classCallCheck(this, BaseB);
        this.x = x;
    }
    _createClass(BaseB, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseB(2);
            }
        }
    ]);
    return BaseB;
}();
var BaseC = /*#__PURE__*/ function() {
    "use strict";
    function BaseC(x) {
        _classCallCheck(this, BaseC);
        this.x = x;
    }
    _createClass(BaseC, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseC(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function staticInstance() {
                new BaseC(4);
            }
        }
    ]);
    return BaseC;
}();
var DerivedA = /*#__PURE__*/ function(BaseA1) {
    "use strict";
    _inherits(DerivedA, BaseA1);
    var _super = _createSuper(DerivedA);
    function DerivedA(x) {
        _classCallCheck(this, DerivedA);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    _createClass(DerivedA, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedA(5);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseA(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseA(7);
            }
        }
    ]);
    return DerivedA;
}(BaseA);
var DerivedB = /*#__PURE__*/ function(BaseB1) {
    "use strict";
    _inherits(DerivedB, BaseB1);
    var _super = _createSuper(DerivedB);
    function DerivedB(x) {
        _classCallCheck(this, DerivedB);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    _createClass(DerivedB, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedB(7);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseB(8);
            } // ok
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseB(9);
            } // ok
        }
    ]);
    return DerivedB;
}(BaseB);
var DerivedC = /*#__PURE__*/ function(BaseC1) {
    "use strict";
    _inherits(DerivedC, BaseC1);
    var _super = _createSuper(DerivedC);
    function DerivedC(x) {
        _classCallCheck(this, DerivedC);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        return _this;
    }
    _createClass(DerivedC, [
        {
            key: "createInstance",
            value: function createInstance() {
                new DerivedC(9);
            }
        },
        {
            key: "createBaseInstance",
            value: function createBaseInstance() {
                new BaseC(10);
            } // error
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseC(11);
            } // error
        }
    ]);
    return DerivedC;
}(BaseC);
var ba = new BaseA(1);
var bb = new BaseB(1); // error
var bc = new BaseC(1); // error
var da = new DerivedA(1);
var db = new DerivedB(1);
var dc = new DerivedC(1);
