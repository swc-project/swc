function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
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
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived1) {
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
        var obj, self, call, result, Super = _getPrototypeOf(Derived1);
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else result = Super.apply(this, arguments);
        return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    };
}
var _class, Base = function(x, y) {
    "use strict";
    _classCallCheck(this, Base), this.x = x, this.y = y;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _createSuper(Derived);
    function Derived(x, y, z) {
        var _this;
        return _classCallCheck(this, Derived), (_this = _super.call(this, x, y)).z = z, _this;
    }
    return Derived;
}(Base);
function Tagged(superClass1) {
    var C = function(superClass) {
        "use strict";
        _inherits(C, superClass);
        var _super = _createSuper(C);
        function C() {
            for(var arr, _this, _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return _classCallCheck(this, C), (_this = _super.call.apply(_super, [
                this
            ].concat(function(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
            }(arr = args) || function(iter) {
                if ("undefined" != typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) return Array.from(iter);
            }(arr) || function(o, minLen) {
                if (o) {
                    if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
                    var n = Object.prototype.toString.call(o).slice(8, -1);
                    if ("Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n) return Array.from(n);
                    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
                }
            }(arr) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
            }())))._tag = "hello", _this;
        }
        return C;
    }(superClass1);
    return C;
}
Tagged(Derived);
var Thing2 = Tagged(((_class = function(superClass) {
    "use strict";
    _inherits(_class, superClass);
    var _super = _createSuper(_class);
    function _class() {
        return _classCallCheck(this, _class), _super.apply(this, arguments);
    }
    return _createClass(_class, [
        {
            key: "print",
            value: function() {
                this.x + this.y;
            }
        }
    ]), _class;
}(Derived)).message = "hello", _class));
Thing2.message;
var Thing3 = function(Thing21) {
    "use strict";
    _inherits(Thing3, Thing21);
    var _super = _createSuper(Thing3);
    function Thing3(tag) {
        var _this;
        return _classCallCheck(this, Thing3), (_this = _super.call(this, 10, 20, 30))._tag = tag, _this;
    }
    return _createClass(Thing3, [
        {
            key: "test",
            value: function() {
                this.print();
            }
        }
    ]), Thing3;
}(Thing2);
