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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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
var C1 = // accessing any protected outside the class is an error
/*#__PURE__*/ function() {
    "use strict";
    function C1() {
        _classCallCheck(this, C1);
        this.a = '';
        this.b = '';
        this.d = function() {
            return '';
        };
    }
    _createClass(C1, [
        {
            key: "c",
            value: function c() {
                return '';
            }
        }
    ], [
        {
            key: "f",
            value: function f() {
                return '';
            }
        }
    ]);
    return C1;
}();
C1.g = function() {
    return '';
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _classCallCheck(this, D);
        return _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
    }
    _createClass(D, [
        {
            key: "method",
            value: function method() {
                // No errors
                var d = new D();
                var r1 = d.x;
                var r2 = d.a;
                var r3 = d.b;
                var r4 = d.c();
                var r5 = d.d();
                var r6 = C1.e;
                var r7 = C1.f();
                var r8 = C1.g();
            }
        }
    ]);
    return D;
}(C1);
