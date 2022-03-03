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
var Private = function Private() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Private);
};
var Private2 = function Private2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Private2);
};
var Protected = function Protected() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Protected);
};
var Protected2 = function Protected2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Protected2);
};
var Public = function Public() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Public);
};
var Public2 = function Public2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _classCallCheck(this, Public2);
};
function f1(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f2(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f3(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f4(x) {
    x.p; // Error, protected when all constituents are protected
}
function f5(x) {
    x.p; // Ok, public if any constituent is public
}
function f6(x) {
    x.p; // Ok, public if any constituent is public
}
var C1 = // Can't derive from type with inaccessible properties
/*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C1, _superClass);
    var _super = _createSuper(C1);
    function C1() {
        _classCallCheck(this, C1);
        return _super.apply(this, arguments);
    }
    return C1;
}(Mix(Private, Private2));
var C2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C2, _superClass);
    var _super = _createSuper(C2);
    function C2() {
        _classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(Mix(Private, Protected));
var C3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C3, _superClass);
    var _super = _createSuper(C3);
    function C3() {
        _classCallCheck(this, C3);
        return _super.apply(this, arguments);
    }
    return C3;
}(Mix(Private, Public));
var C4 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C4, _superClass);
    var _super = _createSuper(C4);
    function C4() {
        _classCallCheck(this, C4);
        return _super.apply(this, arguments);
    }
    _createClass(C4, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p;
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s;
                C5.s;
                C6.s;
            }
        }
    ]);
    return C4;
}(Mix(Protected, Protected2));
var C5 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C5, _superClass);
    var _super = _createSuper(C5);
    function C5() {
        _classCallCheck(this, C5);
        return _super.apply(this, arguments);
    }
    _createClass(C5, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p; // Error, not in class deriving from Protected2
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s; // Error, not in class deriving from Protected2
                C5.s;
                C6.s;
            }
        }
    ]);
    return C5;
}(Mix(Protected, Public));
var C6 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C6, _superClass);
    var _super = _createSuper(C6);
    function C6() {
        _classCallCheck(this, C6);
        return _super.apply(this, arguments);
    }
    _createClass(C6, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p; // Error, not in class deriving from Protected2
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s; // Error, not in class deriving from Protected2
                C5.s;
                C6.s;
            }
        }
    ]);
    return C6;
}(Mix(Public, Public2));
var ProtectedGeneric = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric() {
        _classCallCheck(this, ProtectedGeneric);
    }
    _createClass(ProtectedGeneric, [
        {
            key: "privateMethod",
            value: function privateMethod() {}
        },
        {
            key: "protectedMethod",
            value: function protectedMethod() {}
        }
    ]);
    return ProtectedGeneric;
}();
var ProtectedGeneric2 = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric2() {
        _classCallCheck(this, ProtectedGeneric2);
    }
    _createClass(ProtectedGeneric2, [
        {
            key: "privateMethod",
            value: function privateMethod() {}
        },
        {
            key: "protectedMethod",
            value: function protectedMethod() {}
        }
    ]);
    return ProtectedGeneric2;
}();
function f7(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f8(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f9(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
