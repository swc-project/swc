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
var _this = this, _superprop_get_w = ()=>super.w
;
var Reflect1 = function Reflect1() {
    "use strict";
    _classCallCheck(this, Reflect1);
};
// @target: es5, es2015, es2021, es2022, esnext
// @noTypesAndSymbols: true
// @filename: external.ts
export { Reflect1 as Reflect };
export var Baz;
(function(Baz) {})(Baz || (Baz = {}));
var _class = function _class() {
    "use strict";
    _classCallCheck(this, _class);
};
export { _class as default };
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __32 = {
    writable: true,
    value: function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __1 = {
    writable: true,
    value: function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __2 = {
    writable: true,
    value: function() {
        var Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }()
};
var __3 = {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {
            "use strict";
            _classCallCheck(this, Reflect);
        };
        _superprop_get_w().call(_this);
    }()
};
var __4 = {
    writable: true,
    value: function() {
        var Reflect = function Reflect() {} // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }()
};
var __5 = {
    writable: true,
    value: function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }()
};
var __6 = {
    writable: true,
    value: function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }()
};
var __7 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var __8 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var __9 = {
    writable: true,
    value: function() {
        (function Reflect() {
            "use strict";
            _classCallCheck(this, Reflect);
        }) // no collision
        ;
        _superprop_get_w().call(_this);
    }()
};
var __10 = {
    writable: true,
    value: function() {
        (function Reflect() {}) // no collision
        ;
        _superprop_get_w().call(_this);
    }()
};
C._ = [
    function() {
        var Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect = {
            Reflect: null
        }.Reflect; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect = null; // collision (es2015-es2021 only)
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect = function Reflect() {
            "use strict";
            _classCallCheck(this, Reflect);
        };
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect = function Reflect() {} // collision (es2015-es2021 only)
        ;
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }(),
    function() {
        var Reflect// collision (es2015-es2021 only)
        ;
        (function(Reflect) {})(Reflect || (Reflect = {}));
        _superprop_get_w().call(_this);
    }(),
    function() {
        _superprop_get_w().call(_this);
    }(),
    function() {
        _superprop_get_w().call(_this);
    }(),
    function() {
        (function Reflect() {
            "use strict";
            _classCallCheck(this, Reflect);
        }); // no collision
        _superprop_get_w().call(_this);
    }(),
    function() {
        (function Reflect() {}); // no collision
        _superprop_get_w().call(_this);
    }(), 
];
var Reflect1 = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var Reflect1 = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var Reflect1 = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var Reflect1 = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __11 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var Reflect1 = {
    Reflect: null
}.Reflect; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __12 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var Reflect1 = null; // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __13 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var Reflect1 = function Reflect1() {
    "use strict";
    _classCallCheck(this, Reflect1);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var Reflect1 = function Reflect1() {
    "use strict";
    _classCallCheck(this, Reflect1);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __14 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
function Reflect1() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
function Reflect1() {} // collision (es2015-es2021 only)
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __15 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __16 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
(function(Reflect1) {})(Reflect1 || (Reflect1 = {}));
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
(function(Reflect1) {})(Reflect1 || (Reflect1 = {}));
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __17 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
(function(Reflect1) {})(Reflect1 || (Reflect1 = {}));
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
(function(Reflect1) {})(Reflect1 || (Reflect1 = {}));
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __18 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __19 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __20 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __21 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __22 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __23 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __24 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __25 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __26 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __27 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __28 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __29 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
(function Reflect() {
    "use strict";
    _classCallCheck(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
(function Reflect() {
    "use strict";
    _classCallCheck(this, Reflect);
}); // no collision
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __30 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
_Reflect = function Reflect() {
    "use strict";
    _classCallCheck(this, Reflect);
}, __ = {
    writable: true,
    value: (function() {
        var C = /*#__PURE__*/ function(B) {
            "use strict";
            _inherits(C, B);
            var _super = _createSuper(C);
            function C() {
                _classCallCheck(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(B);
        C._ = _superprop_get_w().call(_this);
    })()
}, _Reflect;
_Reflect = function Reflect() {
    "use strict";
    _classCallCheck(this, Reflect);
}, __ = {
    writable: true,
    value: (function() {
        var _this1 = _this, _superprop_get_w1 = ()=>_superprop_get_w()
        ;
        var _Reflect, __;
        var C = /*#__PURE__*/ function(B) {
            "use strict";
            _inherits(C, B);
            var _super = _createSuper(C);
            function C() {
                _classCallCheck(this, C);
                return _super.apply(this, arguments);
            }
            return C;
        }(B);
        var __33 = {
            writable: true,
            value: function() {
                _superprop_get_w1().call(_this1);
            }()
        };
    })()
}, _Reflect;
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
C._ = super.w();
(function Reflect() {}); // no collision
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _createSuper(C);
    function C() {
        _classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(B);
var __31 = {
    writable: true,
    value: function() {
        _superprop_get_w().call(_this);
    }()
};
(function Reflect() {
    var C = /*#__PURE__*/ function(B) {
        "use strict";
        _inherits(C, B);
        var _super = _createSuper(C);
        function C() {
            _classCallCheck(this, C);
            return _super.apply(this, arguments);
        }
        return C;
    }(B);
    C._ = super.w();
});
(function Reflect() {
    var _this2 = this, _superprop_get_w2 = ()=>super.w
    ;
    var _Reflect, __;
    var C = /*#__PURE__*/ function(B) {
        "use strict";
        _inherits(C, B);
        var _super = _createSuper(C);
        function C() {
            _classCallCheck(this, C);
            return _super.apply(this, arguments);
        }
        return C;
    }(B);
    var __34 = {
        writable: true,
        value: function() {
            _superprop_get_w2().call(_this2);
        }()
    };
});
