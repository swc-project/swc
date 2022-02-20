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
};
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var result, Super = _getPrototypeOf(Derived);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return _possibleConstructorReturn(this, result);
    };
}
export var A = function() {
    "use strict";
    _classCallCheck(this, A);
};
export var B = function() {
    "use strict";
    _classCallCheck(this, B);
};
B.cat = "cat";
export var C = function() {
    "use strict";
    _classCallCheck(this, C);
};
C.Cls = function _class() {
    "use strict";
    _classCallCheck(this, _class);
};
export var D = function(a, b) {
    "use strict";
    _classCallCheck(this, D);
};
export var E = function() {
    "use strict";
    function E(a, b) {
        _classCallCheck(this, E), this.initializedField = 12;
    }
    return _createClass(E, [
        {
            key: "f1",
            get: function() {
                return null;
            },
            set: function(_p) {}
        },
        {
            key: "f2",
            get: function() {
                return null;
            }
        },
        {
            key: "f3",
            set: function(_p) {}
        }
    ], [
        {
            key: "s1",
            get: function() {
                return "";
            },
            set: function(_p) {}
        },
        {
            key: "s2",
            get: function() {
                return "";
            }
        },
        {
            key: "s3",
            set: function(_p) {}
        }
    ]), E;
}();
E.staticInitializedField = 12;
export var F = function() {
    "use strict";
    function F(a, b) {
        _classCallCheck(this, F);
    }
    return _createClass(F, null, [
        {
            key: "create",
            value: function(a, b) {
                return new F(a, b);
            }
        }
    ]), F;
}();
var G = function() {
    "use strict";
    _classCallCheck(this, G);
};
var HH = function() {
    "use strict";
    _classCallCheck(this, HH);
};
export var I = function() {
    "use strict";
    _classCallCheck(this, I);
};
export var J = function J() {
    "use strict";
    _classCallCheck(this, J);
};
export var K = function() {
    "use strict";
    function K() {
        _classCallCheck(this, K), this.p1 = 12, this.p2 = "ok";
    }
    return _createClass(K, [
        {
            key: "method",
            value: function() {
                return this.p1;
            }
        }
    ]), K;
}();
export var L = function(K) {
    "use strict";
    _inherits(L, K);
    var _super = _createSuper(L);
    function L() {
        return _classCallCheck(this, L), _super.apply(this, arguments);
    }
    return L;
}(K);
export var M = function(_super) {
    "use strict";
    function M() {
        var _this;
        return _classCallCheck(this, M), _this.prop = 12, _possibleConstructorReturn(_this);
    }
    return _inherits(M, null), _createSuper(M), M;
}(null);
export var N = function(L) {
    "use strict";
    _inherits(N, L);
    var _super = _createSuper(N);
    function N(param) {
        var _this;
        return _classCallCheck(this, N), (_this = _super.call(this)).another = param, _this;
    }
    return N;
}(L);
export var O = function(N) {
    "use strict";
    _inherits(O, N);
    var _super = _createSuper(O);
    function O(param) {
        var _this;
        return _classCallCheck(this, O), (_this = _super.call(this, param)).another2 = param, _this;
    }
    return O;
}(N);
export var VariableBase = function(x) {
    "use strict";
    _inherits(VariableBase, null);
    var _super = _createSuper(VariableBase);
    function VariableBase() {
        return _classCallCheck(this, VariableBase), _super.apply(this, arguments);
    }
    return VariableBase;
}(null);
export var HasStatics = function() {
    "use strict";
    function HasStatics() {
        _classCallCheck(this, HasStatics);
    }
    return _createClass(HasStatics, null, [
        {
            key: "staticMethod",
            value: function() {}
        }
    ]), HasStatics;
}();
export var ExtendsStatics = function(HasStatics) {
    "use strict";
    _inherits(ExtendsStatics, HasStatics);
    var _super = _createSuper(ExtendsStatics);
    function ExtendsStatics() {
        return _classCallCheck(this, ExtendsStatics), _super.apply(this, arguments);
    }
    return _createClass(ExtendsStatics, null, [
        {
            key: "also",
            value: function() {}
        }
    ]), ExtendsStatics;
}(HasStatics);
export { G, HH as H, I as II, J as JJ };
