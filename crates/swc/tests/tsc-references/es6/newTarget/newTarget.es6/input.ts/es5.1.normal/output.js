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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    var _this = this;
    var _newtarget = this.constructor;
    // @target: es6
    this.d = function _target() {
        return _this.constructor;
    };
    var a = this.constructor;
    var b = function() {
        return _newtarget;
    };
};
A.c = function _target() {
    return _instanceof(this, _target) ? this.constructor : void 0;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _classCallCheck(this, B);
        var _this;
        var _newtarget = _this.constructor;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(B).call(this));
        var e = _this.constructor;
        var f = function() {
            return _newtarget;
        };
        return _this;
    }
    return B;
}(A);
function f1() {
    var _newtarget = _instanceof(this, f1) ? this.constructor : void 0;
    var g = _instanceof(this, f1) ? this.constructor : void 0;
    var h = function() {
        return _newtarget;
    };
}
var f2 = function _target() {
    var _newtarget = _instanceof(this, _target) ? this.constructor : void 0;
    var i = _instanceof(this, _target) ? this.constructor : void 0;
    var j = function() {
        return _newtarget;
    };
};
var O = {
    k: function _target() {
        return _instanceof(this, _target) ? this.constructor : void 0;
    }
};
