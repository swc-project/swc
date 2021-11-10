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
var NonGeneric;
(function(NonGeneric) {
    var C = function C(x) {
        "use strict";
        _classCallCheck(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        _classCallCheck(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _createSuper(D);
        function D() {
            _classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(NonGeneric || (NonGeneric = {
}));
var Generics;
(function(Generics) {
    var C = function C(x) {
        "use strict";
        _classCallCheck(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        _classCallCheck(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1, 2); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _createSuper(D);
        function D() {
            _classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(Generics || (Generics = {
}));
