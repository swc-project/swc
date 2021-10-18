function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, BaseA1 = function() {
    "use strict";
    function BaseA1(x) {
        _classCallCheck(this, BaseA1), this.x = x;
    }
    return _createClass(BaseA1, [
        {
            key: "createInstance",
            value: function() {
                new BaseA1(1);
            }
        }
    ]), BaseA1;
}(), BaseB1 = function() {
    "use strict";
    function BaseB1(x) {
        _classCallCheck(this, BaseB1), this.x = x;
    }
    return _createClass(BaseB1, [
        {
            key: "createInstance",
            value: function() {
                new BaseB1(2);
            }
        }
    ]), BaseB1;
}(), BaseC1 = function() {
    "use strict";
    function BaseC1(x) {
        _classCallCheck(this, BaseC1), this.x = x;
    }
    return _createClass(BaseC1, [
        {
            key: "createInstance",
            value: function() {
                new BaseC1(3);
            }
        }
    ], [
        {
            key: "staticInstance",
            value: function() {
                new BaseC1(4);
            }
        }
    ]), BaseC1;
}(), DerivedA = function(BaseA) {
    "use strict";
    function DerivedA(x) {
        var _this;
        return _classCallCheck(this, DerivedA), (_this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedA).call(this, x))).x = x, _this;
    }
    return _inherits(DerivedA, BaseA), _createClass(DerivedA, [
        {
            key: "createInstance",
            value: function() {
                new DerivedA(5);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseA1(6);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseA1(7);
            }
        }
    ]), DerivedA;
}(BaseA1), DerivedB = function(BaseB) {
    "use strict";
    function DerivedB(x) {
        var _this;
        return _classCallCheck(this, DerivedB), (_this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedB).call(this, x))).x = x, _this;
    }
    return _inherits(DerivedB, BaseB), _createClass(DerivedB, [
        {
            key: "createInstance",
            value: function() {
                new DerivedB(7);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseB1(8);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseB1(9);
            }
        }
    ]), DerivedB;
}(BaseB1), DerivedC = function(BaseC) {
    "use strict";
    function DerivedC(x) {
        var _this;
        return _classCallCheck(this, DerivedC), (_this = _possibleConstructorReturn(this, _getPrototypeOf(DerivedC).call(this, x))).x = x, _this;
    }
    return _inherits(DerivedC, BaseC), _createClass(DerivedC, [
        {
            key: "createInstance",
            value: function() {
                new DerivedC(9);
            }
        },
        {
            key: "createBaseInstance",
            value: function() {
                new BaseC1(10);
            }
        }
    ], [
        {
            key: "staticBaseInstance",
            value: function() {
                new BaseC1(11);
            }
        }
    ]), DerivedC;
}(BaseC1);
new BaseA1(1), new BaseB1(1), new BaseC1(1), new DerivedA(1), new DerivedB(1), new DerivedC(1);
