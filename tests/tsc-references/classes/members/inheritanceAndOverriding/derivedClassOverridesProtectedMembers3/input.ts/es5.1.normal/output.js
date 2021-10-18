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
// @target: ES5
var x;
var y;
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base(a) {
        _classCallCheck(this, Base);
    }
    _createClass(Base, [
        {
            key: "b",
            value: function b(a) {
            }
        },
        {
            key: "c",
            get: function get() {
                return x;
            },
            set: function set(v) {
            }
        }
    ], [
        {
            key: "s",
            value: function s(a) {
            }
        },
        {
            key: "t",
            get: function get() {
                return x;
            },
            set: function set(v) {
            }
        }
    ]);
    return Base;
}();
var Derived1 = // Errors
// decrease visibility of all public members to protected
/*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    function Derived1(a) {
        _classCallCheck(this, Derived1);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived1).call(this, a));
    }
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    function Derived2(a) {
        _classCallCheck(this, Derived2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived2).call(this, a));
    }
    _createClass(Derived2, [
        {
            key: "b",
            value: function b(a) {
            }
        }
    ]);
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    function Derived3(a) {
        _classCallCheck(this, Derived3);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived3).call(this, a));
    }
    _createClass(Derived3, [
        {
            key: "c",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    function Derived4(a) {
        _classCallCheck(this, Derived4);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived4).call(this, a));
    }
    _createClass(Derived4, [
        {
            key: "c",
            set: function set(v) {
            }
        }
    ]);
    return Derived4;
}(Base);
var Derived5 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived5, Base);
    function Derived5(a) {
        _classCallCheck(this, Derived5);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived5).call(this, a));
    }
    return Derived5;
}(Base);
var Derived6 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived6, Base);
    function Derived6(a) {
        _classCallCheck(this, Derived6);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived6).call(this, a));
    }
    return Derived6;
}(Base);
var Derived7 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived7, Base);
    function Derived7(a) {
        _classCallCheck(this, Derived7);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived7).call(this, a));
    }
    _createClass(Derived7, null, [
        {
            key: "s",
            value: function s(a) {
            }
        }
    ]);
    return Derived7;
}(Base);
var Derived8 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived8, Base);
    function Derived8(a) {
        _classCallCheck(this, Derived8);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived8).call(this, a));
    }
    _createClass(Derived8, null, [
        {
            key: "t",
            get: function get() {
                return x;
            }
        }
    ]);
    return Derived8;
}(Base);
var Derived9 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived9, Base);
    function Derived9(a) {
        _classCallCheck(this, Derived9);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived9).call(this, a));
    }
    _createClass(Derived9, null, [
        {
            key: "t",
            set: function set(v) {
            }
        }
    ]);
    return Derived9;
}(Base);
var Derived10 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived10, Base);
    function Derived10(a) {
        _classCallCheck(this, Derived10);
        return _possibleConstructorReturn(this, _getPrototypeOf(Derived10).call(this, a));
    }
    return Derived10;
}(Base);
