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
var BaseA1 = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function BaseA1(x) {
        _classCallCheck(this, BaseA1);
        this.x = x;
    }
    _createClass(BaseA1, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseA1(1);
            }
        }
    ]);
    return BaseA1;
}();
var BaseB1 = /*#__PURE__*/ function() {
    "use strict";
    function BaseB1(x) {
        _classCallCheck(this, BaseB1);
        this.x = x;
    }
    _createClass(BaseB1, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseB1(2);
            }
        }
    ]);
    return BaseB1;
}();
var BaseC1 = /*#__PURE__*/ function() {
    "use strict";
    function BaseC1(x) {
        _classCallCheck(this, BaseC1);
        this.x = x;
    }
    _createClass(BaseC1, [
        {
            key: "createInstance",
            value: function createInstance() {
                new BaseC1(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function staticInstance() {
                new BaseC1(4);
            }
        }
    ]);
    return BaseC1;
}();
var DerivedA = /*#__PURE__*/ function(BaseA) {
    "use strict";
    _inherits(DerivedA, BaseA);
    function DerivedA(x) {
        _classCallCheck(this, DerivedA);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedA).call(this, x));
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
                new BaseA1(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseA1(7);
            }
        }
    ]);
    return DerivedA;
}(BaseA1);
var DerivedB = /*#__PURE__*/ function(BaseB) {
    "use strict";
    _inherits(DerivedB, BaseB);
    function DerivedB(x) {
        _classCallCheck(this, DerivedB);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedB).call(this, x));
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
                new BaseB1(8);
            } // ok
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseB1(9);
            } // ok
        }
    ]);
    return DerivedB;
}(BaseB1);
var DerivedC = /*#__PURE__*/ function(BaseC) {
    "use strict";
    _inherits(DerivedC, BaseC);
    function DerivedC(x) {
        _classCallCheck(this, DerivedC);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedC).call(this, x));
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
                new BaseC1(10);
            } // error
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function staticBaseInstance() {
                new BaseC1(11);
            } // error
        }
    ]);
    return DerivedC;
}(BaseC1);
var ba = new BaseA1(1);
var bb = new BaseB1(1); // error
var bc = new BaseC1(1); // error
var da = new DerivedA(1);
var db = new DerivedB(1);
var dc = new DerivedC(1);
