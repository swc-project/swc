function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var E, E1, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, C3 = function() {
    "use strict";
    _classCallCheck(this, C3);
}, D1 = function(C3) {
    "use strict";
    function D1() {
        var self, call;
        return _classCallCheck(this, D1), self = this, call = _getPrototypeOf(D1).apply(this, arguments), call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(D1, C3), D1;
}(C3), C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
}, C2 = function() {
    "use strict";
    _classCallCheck(this, C2);
};
function f() {
}
(E1 = E || (E = {
}))[E1.A = 0] = "A", (f || (f = {
})).bar = 1;
var c = function() {
    "use strict";
    _classCallCheck(this, c);
};
(c || (c = {
})).bar = 1;
