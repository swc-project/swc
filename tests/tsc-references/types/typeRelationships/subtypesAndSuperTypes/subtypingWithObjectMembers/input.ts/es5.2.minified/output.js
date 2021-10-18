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
var TwoLevels, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, Base = function() {
    "use strict";
    _classCallCheck(this, Base);
}, Derived = function(Base) {
    "use strict";
    function Derived() {
        return _classCallCheck(this, Derived), _possibleConstructorReturn(this, _getPrototypeOf(Derived).apply(this, arguments));
    }
    return _inherits(Derived, Base), Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    function Derived2() {
        return _classCallCheck(this, Derived2), _possibleConstructorReturn(this, _getPrototypeOf(Derived2).apply(this, arguments));
    }
    return _inherits(Derived2, Derived), Derived2;
}(Derived), A = function() {
    "use strict";
    _classCallCheck(this, A);
}, B = function(A) {
    "use strict";
    function B() {
        return _classCallCheck(this, B), _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
    }
    return _inherits(B, A), B;
}(A), A2 = function() {
    "use strict";
    _classCallCheck(this, A2);
}, B2 = function(A2) {
    "use strict";
    function B2() {
        return _classCallCheck(this, B2), _possibleConstructorReturn(this, _getPrototypeOf(B2).apply(this, arguments));
    }
    return _inherits(B2, A2), B2;
}(A2), A3 = function() {
    "use strict";
    _classCallCheck(this, A3);
}, B3 = function(A3) {
    "use strict";
    function B3() {
        return _classCallCheck(this, B3), _possibleConstructorReturn(this, _getPrototypeOf(B3).apply(this, arguments));
    }
    return _inherits(B3, A3), B3;
}(A3);
!function(TwoLevels) {
    var A1 = function() {
        "use strict";
        _classCallCheck(this, A1);
    }, B = function(A) {
        "use strict";
        function B() {
            return _classCallCheck(this, B), _possibleConstructorReturn(this, _getPrototypeOf(B).apply(this, arguments));
        }
        return _inherits(B, A), B;
    }(A1), A21 = function() {
        "use strict";
        _classCallCheck(this, A21);
    }, B2 = function(A2) {
        "use strict";
        function B2() {
            return _classCallCheck(this, B2), _possibleConstructorReturn(this, _getPrototypeOf(B2).apply(this, arguments));
        }
        return _inherits(B2, A2), B2;
    }(A21), A31 = function() {
        "use strict";
        _classCallCheck(this, A31);
    }, B3 = function(A3) {
        "use strict";
        function B3() {
            return _classCallCheck(this, B3), _possibleConstructorReturn(this, _getPrototypeOf(B3).apply(this, arguments));
        }
        return _inherits(B3, A3), B3;
    }(A31);
}(TwoLevels || (TwoLevels = {
}));
