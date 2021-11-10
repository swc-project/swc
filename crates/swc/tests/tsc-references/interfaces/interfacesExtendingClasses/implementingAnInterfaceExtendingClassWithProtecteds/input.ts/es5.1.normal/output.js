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
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var Bar = function Bar() {
    "use strict";
    _classCallCheck(this, Bar);
};
var Bar2 = function Bar2() {
    "use strict";
    _classCallCheck(this, Bar2);
};
var Bar3 = function Bar3() {
    "use strict";
    _classCallCheck(this, Bar3);
};
var Bar4 = function Bar4() {
    "use strict";
    _classCallCheck(this, Bar4);
};
var Bar5 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar5, Foo);
    var _super = _createSuper(Bar5);
    function Bar5() {
        _classCallCheck(this, Bar5);
        return _super.apply(this, arguments);
    }
    return Bar5;
}(Foo);
var Bar6 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar6, Foo);
    var _super = _createSuper(Bar6);
    function Bar6() {
        _classCallCheck(this, Bar6);
        return _super.apply(this, arguments);
    }
    return Bar6;
}(Foo);
var Bar7 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar7, Foo);
    var _super = _createSuper(Bar7);
    function Bar7() {
        _classCallCheck(this, Bar7);
        return _super.apply(this, arguments);
    }
    return Bar7;
}(Foo);
var Bar8 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar8, Foo);
    var _super = _createSuper(Bar8);
    function Bar8() {
        _classCallCheck(this, Bar8);
        return _super.apply(this, arguments);
    }
    return Bar8;
}(Foo);
