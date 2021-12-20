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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
        _get = Reflect.get;
    } else {
        _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) {
                return desc.get.call(receiver);
            }
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
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
function _superPropBase(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _getPrototypeOf(object);
        if (object === null) break;
    }
    return object;
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
var c1 = /*#__PURE__*/ function() {
    "use strict";
    function c1() {
        _classCallCheck(this, c1);
    }
    _createClass(c1, [
        {
            key: "i1_f1",
            value: function i1_f1() {
            }
        },
        {
            key: "i1_nc_f1",
            value: function i1_nc_f1() {
            }
        },
        {
            key: "f1",
            value: /** c1_f1*/ function f1() {
            }
        },
        {
            key: "nc_f1",
            value: /** c1_nc_f1*/ function nc_f1() {
            }
        }
    ]);
    return c1;
}();
var i1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1();
c1_i.i1_nc_f1();
c1_i.f1();
c1_i.nc_f1();
c1_i.i1_l1();
c1_i.i1_nc_l1();
c1_i.l1();
c1_i.nc_l1();
// assign to interface
i1_i = c1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
var c2 = /*#__PURE__*/ function() {
    "use strict";
    function c2(a) {
        _classCallCheck(this, c2);
        this.c2_p1 = a;
    }
    _createClass(c2, [
        {
            key: "c2_f1",
            value: /** c2 c2_f1*/ function c2_f1() {
            }
        },
        {
            key: "c2_prop",
            get: /** c2 c2_prop*/ function get() {
                return 10;
            }
        },
        {
            key: "c2_nc_f1",
            value: function c2_nc_f1() {
            }
        },
        {
            key: "c2_nc_prop",
            get: function get() {
                return 10;
            }
        },
        {
            key: "f1",
            value: /** c2 f1*/ function f1() {
            }
        },
        {
            key: "prop",
            get: /** c2 prop*/ function get() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function nc_f1() {
            }
        },
        {
            key: "nc_prop",
            get: function get() {
                return 10;
            }
        }
    ]);
    return c2;
}();
var c3 = /*#__PURE__*/ function(c2) {
    "use strict";
    _inherits(c3, c2);
    var _super = _createSuper(c3);
    function c3() {
        _classCallCheck(this, c3);
        var _thisSuper, _this;
        _this = _super.call(this, 10);
        _this.p1 = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(c3.prototype)), "c2_p1", _thisSuper);
        return _this;
    }
    _createClass(c3, [
        {
            key: "f1",
            value: /** c3 f1*/ function f1() {
            }
        },
        {
            key: "prop",
            get: /** c3 prop*/ function get() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function nc_f1() {
            }
        },
        {
            key: "nc_prop",
            get: function get() {
                return 10;
            }
        }
    ]);
    return c3;
}(c2);
var c2_i = new c2(10);
var c3_i = new c3();
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
c3_i.c2_f1();
c3_i.c2_nc_f1();
c3_i.f1();
c3_i.nc_f1();
// assign
c2_i = c3_i;
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
var c4 = /*#__PURE__*/ function(c2) {
    "use strict";
    _inherits(c4, c2);
    var _super = _createSuper(c4);
    function c4() {
        _classCallCheck(this, c4);
        return _super.apply(this, arguments);
    }
    return c4;
}(c2);
var c4_i = new c4(10);
var i2_i;
var i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
i3_i.i2_f1();
i3_i.i2_nc_f1();
i3_i.f1();
i3_i.nc_f1();
i3_i.i2_l1();
i3_i.i2_nc_l1();
i3_i.l1();
i3_i.nc_l1();
// assign to interface
i2_i = i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
var c5 = function c5() {
    "use strict";
    _classCallCheck(this, c5);
};
var c6 = /*#__PURE__*/ function(c5) {
    "use strict";
    _inherits(c6, c5);
    var _super = _createSuper(c6);
    function c6() {
        _classCallCheck(this, c6);
        var _thisSuper, _this;
        _this = _super.call(this);
        _this.d = _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(c6.prototype)), "b", _thisSuper);
        return _this;
    }
    return c6;
}(c5);
