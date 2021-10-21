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
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
var Bar = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar, Foo);
    function Bar() {
        _classCallCheck(this, Bar);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar).apply(this, arguments));
    }
    return Bar;
}(Foo);
var Bar2 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar2, Foo);
    function Bar2() {
        _classCallCheck(this, Bar2);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar2).apply(this, arguments));
    }
    return Bar2;
}(Foo);
var Bar3 = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Bar3, Foo);
    function Bar3() {
        _classCallCheck(this, Bar3);
        return _possibleConstructorReturn(this, _getPrototypeOf(Bar3).apply(this, arguments));
    }
    return Bar3;
}(Foo);
// another level of indirection
var M;
(function(M) {
    var Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        function Baz() {
            _classCallCheck(this, Baz);
            return _possibleConstructorReturn(this, _getPrototypeOf(Baz).apply(this, arguments));
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        function Bar() {
            _classCallCheck(this, Bar);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar).apply(this, arguments));
        }
        return Bar;
    }(Foo);
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        function Bar2() {
            _classCallCheck(this, Bar2);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar2).apply(this, arguments));
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        function Bar3() {
            _classCallCheck(this, Bar3);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar3).apply(this, arguments));
        }
        return Bar3;
    }(Foo);
})(M || (M = {
}));
// two levels of privates
var M2;
(function(M2) {
    var Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    };
    var Baz = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Baz, Foo);
        function Baz() {
            _classCallCheck(this, Baz);
            return _possibleConstructorReturn(this, _getPrototypeOf(Baz).apply(this, arguments));
        }
        return Baz;
    }(Foo);
    var Bar = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar, Foo);
        function Bar() {
            _classCallCheck(this, Bar);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar).apply(this, arguments));
        }
        return Bar;
    }(Foo);
    var b;
    var r1 = b.z;
    var r2 = b.x; // error
    var r3 = b.y; // error
    var Bar2 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar2, Foo);
        function Bar2() {
            _classCallCheck(this, Bar2);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar2).apply(this, arguments));
        }
        return Bar2;
    }(Foo);
    var Bar3 = /*#__PURE__*/ function(Foo) {
        "use strict";
        _inherits(Bar3, Foo);
        function Bar3() {
            _classCallCheck(this, Bar3);
            return _possibleConstructorReturn(this, _getPrototypeOf(Bar3).apply(this, arguments));
        }
        return Bar3;
    }(Foo);
})(M2 || (M2 = {
}));
