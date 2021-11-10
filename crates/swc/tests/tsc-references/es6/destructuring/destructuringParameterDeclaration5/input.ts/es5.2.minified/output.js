function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
function _createSuper(Derived) {
    var hasNativeReflectConstruct = function() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
        } catch (e) {
            return !1;
        }
    }();
    return function() {
        var obj, self, call, result, Super = _getPrototypeOf(Derived);
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
var Class1 = function() {
    "use strict";
    _classCallCheck(this, Class1);
}, SubClass = function(Class) {
    "use strict";
    _inherits(SubClass, Class);
    var _super = _createSuper(SubClass);
    function SubClass() {
        return _classCallCheck(this, SubClass), _super.call(this);
    }
    return SubClass;
}(Class1), D1 = function() {
    "use strict";
    _classCallCheck(this, D1);
}, SubD = function(D) {
    "use strict";
    _inherits(SubD, D);
    var _super = _createSuper(SubD);
    function SubD() {
        return _classCallCheck(this, SubD), _super.call(this);
    }
    return SubD;
}(D1);
function d0(param) {
    (void 0 === param ? {
        x: new Class1()
    } : param).x;
}
function d1(param) {
    param.x;
}
function d2(param) {
    param.x;
}
function d3(param) {
    param.y;
}
new Class1(), d0({
    x: 1
}), d0({
    x: {
    }
}), d0({
    x: "string"
}), d1({
    x: new Class1()
}), d1({
    x: {
    }
}), d1({
    x: "string"
}), d2({
    x: new SubClass()
}), d2({
    x: {
    }
}), d3({
    y: new SubD()
}), d3({
    y: new SubClass()
}), d3({
    y: new Class1()
}), d3({
}), d3({
    y: 1
}), d3({
    y: "world"
});
