function _assertThisInitialized(self) {
    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
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
function _get(target, property, receiver) {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (base) {
            var desc = Object.getOwnPropertyDescriptor(base, property);
            return desc.get ? desc.get.call(receiver) : desc.value;
        }
    }, _get(target, property, receiver || target);
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
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _superPropBase(object, property) {
    for(; !Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)););
    return object;
}
var i1_i, i2_i, i3_i, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, c1 = function() {
    "use strict";
    function c1() {
        _classCallCheck(this, c1);
    }
    return _createClass(c1, [
        {
            key: "i1_f1",
            value: function() {
            }
        },
        {
            key: "i1_nc_f1",
            value: function() {
            }
        },
        {
            key: "f1",
            value: function() {
            }
        },
        {
            key: "nc_f1",
            value: function() {
            }
        }
    ]), c1;
}();
i1_i.i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1(), c1_i.i1_nc_f1(), c1_i.f1(), c1_i.nc_f1(), c1_i.i1_l1(), c1_i.i1_nc_l1(), c1_i.l1(), c1_i.nc_l1(), (i1_i = c1_i).i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var c2 = function() {
    "use strict";
    function c2(a) {
        _classCallCheck(this, c2), this.c2_p1 = a;
    }
    return _createClass(c2, [
        {
            key: "c2_f1",
            value: function() {
            }
        },
        {
            key: "c2_prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "c2_nc_f1",
            value: function() {
            }
        },
        {
            key: "c2_nc_prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "f1",
            value: function() {
            }
        },
        {
            key: "prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function() {
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c2;
}(), c3 = function(c2) {
    "use strict";
    function c3() {
        var _this;
        return _classCallCheck(this, c3), (_this = _possibleConstructorReturn(this, _getPrototypeOf(c3).call(this, 10))).p1 = _get(_getPrototypeOf(c3.prototype), "c2_p1", _assertThisInitialized(_this)), _this;
    }
    return _inherits(c3, c2), _createClass(c3, [
        {
            key: "f1",
            value: function() {
            }
        },
        {
            key: "prop",
            get: function() {
                return 10;
            }
        },
        {
            key: "nc_f1",
            value: function() {
            }
        },
        {
            key: "nc_prop",
            get: function() {
                return 10;
            }
        }
    ]), c3;
}(c2), c2_i = new c2(10), c3_i = new c3();
c2_i.c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), c3_i.c2_f1(), c3_i.c2_nc_f1(), c3_i.f1(), c3_i.nc_f1(), (c2_i = c3_i).c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1();
var c4 = function(c2) {
    "use strict";
    function c4() {
        return _classCallCheck(this, c4), _possibleConstructorReturn(this, _getPrototypeOf(c4).apply(this, arguments));
    }
    return _inherits(c4, c2), c4;
}(c2);
new c4(10), i2_i.i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1(), i3_i.i2_f1(), i3_i.i2_nc_f1(), i3_i.f1(), i3_i.nc_f1(), i3_i.i2_l1(), i3_i.i2_nc_l1(), i3_i.l1(), i3_i.nc_l1(), (i2_i = i3_i).i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1();
var c5 = function() {
    "use strict";
    _classCallCheck(this, c5);
}, c6 = function(c5) {
    "use strict";
    function c6() {
        var _this;
        return _classCallCheck(this, c6), (_this = _possibleConstructorReturn(this, _getPrototypeOf(c6).call(this))).d = _get(_getPrototypeOf(c6.prototype), "b", _assertThisInitialized(_this)), _this;
    }
    return _inherits(c6, c5), c6;
}(c5);
