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
}, Foo = function() {
    "use strict";
    _classCallCheck(this, Foo);
}, Bar = function() {
    "use strict";
    _classCallCheck(this, Bar);
}, Bar2 = function() {
    "use strict";
    _classCallCheck(this, Bar2);
}, Bar3 = function() {
    "use strict";
    _classCallCheck(this, Bar3);
}, Bar4 = function() {
    "use strict";
    _classCallCheck(this, Bar4);
}, Bar5 = function(Foo) {
    "use strict";
    function Bar5() {
        return _classCallCheck(this, Bar5), _possibleConstructorReturn(this, _getPrototypeOf(Bar5).apply(this, arguments));
    }
    return _inherits(Bar5, Foo), Bar5;
}(Foo), Bar6 = function(Foo) {
    "use strict";
    function Bar6() {
        return _classCallCheck(this, Bar6), _possibleConstructorReturn(this, _getPrototypeOf(Bar6).apply(this, arguments));
    }
    return _inherits(Bar6, Foo), Bar6;
}(Foo), Bar7 = function(Foo) {
    "use strict";
    function Bar7() {
        return _classCallCheck(this, Bar7), _possibleConstructorReturn(this, _getPrototypeOf(Bar7).apply(this, arguments));
    }
    return _inherits(Bar7, Foo), Bar7;
}(Foo), Bar8 = function(Foo) {
    "use strict";
    function Bar8() {
        return _classCallCheck(this, Bar8), _possibleConstructorReturn(this, _getPrototypeOf(Bar8).apply(this, arguments));
    }
    return _inherits(Bar8, Foo), Bar8;
}(Foo);
