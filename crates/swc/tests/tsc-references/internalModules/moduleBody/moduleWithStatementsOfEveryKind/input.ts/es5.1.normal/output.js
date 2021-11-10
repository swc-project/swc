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
(function(A2) {
    var F = function F(s) {
        return 2;
    };
    var A1 = function A1() {
        "use strict";
        _classCallCheck(this, A1);
    };
    var AA = function AA() {
        "use strict";
        _classCallCheck(this, AA);
    };
    var B = /*#__PURE__*/ function(AA) {
        "use strict";
        _inherits(B, AA);
        var _super = _createSuper(B);
        function B() {
            _classCallCheck(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(AA);
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _createSuper(BB);
        function BB() {
            _classCallCheck(this, BB);
            return _super.apply(this, arguments);
        }
        return BB;
    }(A1);
    var Module;
    (function(Module) {
        var A = function A() {
            "use strict";
            _classCallCheck(this, A);
        };
    })(Module || (Module = {
    }));
    var Color1;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color1 || (Color1 = {
    }));
    var x = 12;
    var array = null;
    var fn = function(s) {
        return 'hello ' + s;
    };
    var ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(A || (A = {
}));
var Y1;
(function(Y) {
    var F = function F(s) {
        return 2;
    };
    var A = function A() {
        "use strict";
        _classCallCheck(this, A);
    };
    Y.A = A;
    var AA = function AA() {
        "use strict";
        _classCallCheck(this, AA);
    };
    Y.AA = AA;
    var B = /*#__PURE__*/ function(AA) {
        "use strict";
        _inherits(B, AA);
        var _super = _createSuper(B);
        function B() {
            _classCallCheck(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(AA);
    Y.B = B;
    var BB = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(BB, A);
        var _super = _createSuper(BB);
        function BB() {
            _classCallCheck(this, BB);
            return _super.apply(this, arguments);
        }
        return BB;
    }(A);
    Y.BB = BB;
    (function(Module) {
        var A = function A() {
            "use strict";
            _classCallCheck(this, A);
        };
    })(Module || (Module = {
    }));
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color || (Color = {
    }));
    Y.x = 12;
    Y.F = F;
    Y.array = null;
    Y.fn = function(s) {
        return 'hello ' + s;
    };
    Y.ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(Y1 || (Y1 = {
}));
