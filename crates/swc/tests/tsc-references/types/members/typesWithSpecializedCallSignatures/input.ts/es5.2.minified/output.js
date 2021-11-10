function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
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
var i1, a, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Base1 = function() {
    "use strict";
    _classCallCheck(this, Base1);
}, Derived1 = function(Base) {
    "use strict";
    function Derived1() {
        return _classCallCheck(this, Derived1), _possibleConstructorReturn(this, _getPrototypeOf(Derived1).apply(this, arguments));
    }
    return _inherits(Derived1, Base), Derived1;
}(Base1), Derived2 = function(Base) {
    "use strict";
    function Derived2() {
        return _classCallCheck(this, Derived2), _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
    }
    return _inherits(Derived2, Base), Derived2;
}(Base1), C = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function C() {
        _classCallCheck(this, C);
    }
    return Constructor = C, protoProps = [
        {
            key: "foo",
            value: function(x) {
                return x;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), C;
}(), c = new C();
c = i1, i1 = c = a, i1 = a, a = c, a = i1, c.foo("hi"), c.foo("bye"), c.foo("hm");
