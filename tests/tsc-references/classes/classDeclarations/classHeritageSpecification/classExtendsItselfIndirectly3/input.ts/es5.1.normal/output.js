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
var C = // @Filename: classExtendsItselfIndirectly_file1.ts
/*#__PURE__*/ function(E) {
    "use strict";
    _inherits(C, E);
    function C() {
        _classCallCheck(this, C);
        return _possibleConstructorReturn(this, _getPrototypeOf(C).apply(this, arguments));
    }
    return C;
} // error
(E1);
var D = // @Filename: classExtendsItselfIndirectly_file2.ts
/*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _classCallCheck(this, D);
        return _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
    }
    return D;
}(C);
var E1 = // @Filename: classExtendsItselfIndirectly_file3.ts
/*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E1, D);
    function E1() {
        _classCallCheck(this, E1);
        return _possibleConstructorReturn(this, _getPrototypeOf(E1).apply(this, arguments));
    }
    return E1;
}(D);
var C2 = // @Filename: classExtendsItselfIndirectly_file4.ts
/*#__PURE__*/ function(E2) {
    "use strict";
    _inherits(C2, E2);
    function C2() {
        _classCallCheck(this, C2);
        return _possibleConstructorReturn(this, _getPrototypeOf(C2).apply(this, arguments));
    }
    return C2;
} // error
(E21);
var D2 = // @Filename: classExtendsItselfIndirectly_file5.ts
/*#__PURE__*/ function(C2) {
    "use strict";
    _inherits(D2, C2);
    function D2() {
        _classCallCheck(this, D2);
        return _possibleConstructorReturn(this, _getPrototypeOf(D2).apply(this, arguments));
    }
    return D2;
}(C2);
var E21 = // @Filename: classExtendsItselfIndirectly_file6.ts
/*#__PURE__*/ function(D2) {
    "use strict";
    _inherits(E21, D2);
    function E21() {
        _classCallCheck(this, E21);
        return _possibleConstructorReturn(this, _getPrototypeOf(E21).apply(this, arguments));
    }
    return E21;
}(D2);
