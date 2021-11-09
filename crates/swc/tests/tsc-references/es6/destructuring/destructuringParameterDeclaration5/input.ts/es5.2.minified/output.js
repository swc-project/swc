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
}, Class1 = function() {
    "use strict";
    _classCallCheck(this, Class1);
}, SubClass = function(Class) {
    "use strict";
    function SubClass() {
        return _classCallCheck(this, SubClass), _possibleConstructorReturn(this, _getPrototypeOf(SubClass).call(this));
    }
    return _inherits(SubClass, Class), SubClass;
}(Class1), D1 = function() {
    "use strict";
    _classCallCheck(this, D1);
}, SubD = function(D) {
    "use strict";
    function SubD() {
        return _classCallCheck(this, SubD), _possibleConstructorReturn(this, _getPrototypeOf(SubD).call(this));
    }
    return _inherits(SubD, D), SubD;
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
