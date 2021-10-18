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
var C = // @useDefineForClassFields: true
// @target: esnext
/*#__PURE__*/ function() {
    "use strict";
    function C(foo) {
        _classCallCheck(this, C);
        this.foo = foo;
        this.qux // should error
         = this.bar;
        this.bar // should error
         = this.foo;
        this.quiz // ok
         = this.bar;
        this.quench // ok
         = this.m1();
        this.quanch // should error
         = this.m3();
        this.m3 = function() {
        };
        this.quim // should error
         = this.baz;
        this.baz // should error
         = this.foo;
        this.quid // ok
         = this.baz;
    }
    _createClass(C, [
        {
            key: "m1",
            value: function m1() {
                this.foo // ok
                ;
            }
        },
        {
            key: "m2",
            value: function m2() {
                this.foo // ok
                ;
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
        _this.quill // ok
         = _this.foo;
        return _this;
    }
    return D;
}(C);
var E = function E(foo2) {
    "use strict";
    var _this = this;
    _classCallCheck(this, E);
    this.foo2 = foo2;
    this.bar // both ok
     = function() {
        return _this.foo1 + _this.foo2;
    };
    this.foo1 = '';
};
var F = function F() {
    "use strict";
    _classCallCheck(this, F);
    this.Inner = /*#__PURE__*/ (function(F) {
        _inherits(_class, F);
        function _class() {
            _classCallCheck(this, _class);
            var _this;
            _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
            _this.p2 = _this.p1;
            return _this;
        }
        return _class;
    })(F);
    this.p1 = 0;
};
var G = function G(p1) {
    "use strict";
    _classCallCheck(this, G);
    this.p1 = p1;
    this.Inner = /*#__PURE__*/ (function(G) {
        _inherits(_class, G);
        function _class() {
            _classCallCheck(this, _class);
            var _this;
            _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
            _this.p2 = _this.p1;
            return _this;
        }
        return _class;
    })(G);
};
