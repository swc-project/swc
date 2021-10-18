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
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.self = this;
        this.c = new C();
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo() {
                return this;
            }
        },
        {
            key: "f1",
            value: function f1() {
                this.c = this.self;
                this.self = this.c; // Error
            }
        },
        {
            key: "f2",
            value: function f2() {
                var a;
                var a = [
                    this,
                    this.c
                ]; // C[] since this is subtype of C
                var b;
                var b = [
                    this,
                    this.self,
                    null,
                    undefined
                ];
            }
        },
        {
            key: "f3",
            value: function f3(b) {
                return b ? this.c : this.self; // Should be C
            }
        }
    ]);
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _classCallCheck(this, D);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
        _this.self1 = _assertThisInitialized(_this);
        _this.self2 = _this.self;
        _this.self3 = _this.foo();
        _this.d = new D();
        return _this;
    }
    _createClass(D, [
        {
            key: "bar",
            value: function bar() {
                this.self = this.self1;
                this.self = this.self2;
                this.self = this.self3;
                this.self1 = this.self;
                this.self2 = this.self;
                this.self3 = this.self;
                this.d = this.self;
                this.d = this.c; // Error
                this.self = this.d; // Error
                this.c = this.d;
            }
        }
    ]);
    return D;
}(C);
