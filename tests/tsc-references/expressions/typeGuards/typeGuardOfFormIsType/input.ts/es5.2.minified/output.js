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
var c1Orc2, c2Ord1, C11 = function() {
    "use strict";
    _classCallCheck(this, C11);
}, C2 = function() {
    "use strict";
    _classCallCheck(this, C2);
}, D1 = function(C1) {
    "use strict";
    function D1() {
        var self, call, obj;
        return _classCallCheck(this, D1), self = this, call = _getPrototypeOf(D1).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
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
    }(D1, C1), D1;
}(C11);
function isC1(x) {
    return !0;
}
function isC2(x) {
    return !0;
}
function isD1(x) {
    return !0;
}
isC1(c1Orc2) && c1Orc2.p1, isC2(c1Orc2) && c1Orc2.p2, isD1(c1Orc2) && c1Orc2.p1, isD1(c1Orc2) && c1Orc2.p3, isC2(c2Ord1) && c2Ord1.p2, isD1(c2Ord1) && c2Ord1.p3, isD1(c2Ord1) && c2Ord1.p1, isC1(c2Ord1);
