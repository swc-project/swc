function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
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
}, _this = this, B = function() {
    "use strict";
    function B() {
        _classCallCheck(this, B), this.n = 1;
    }
    return _createClass(B, [
        {
            key: "foo",
            value: function() {
            }
        }
    ]), B;
}(), C = function(B) {
    "use strict";
    function C() {
        return _classCallCheck(this, C), _possibleConstructorReturn(this, _getPrototypeOf(C).apply(this, arguments));
    }
    return _inherits(C, B), C;
}(B);
C.prototype.foo = function() {
};
var D = function(B) {
    "use strict";
    function D() {
        return _classCallCheck(this, D), _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
    }
    return _inherits(D, B), D;
}(B);
D.prototype.foo = function() {
    _this.n = "not checked, so no error";
};
var Module1 = function() {
    "use strict";
    _classCallCheck(this, Module1);
};
Module1.prototype.identifier = void 0, Module1.prototype.size = null;
var NormalModule = function(Module) {
    "use strict";
    function NormalModule() {
        return _classCallCheck(this, NormalModule), _possibleConstructorReturn(this, _getPrototypeOf(NormalModule).apply(this, arguments));
    }
    return _inherits(NormalModule, Module), _createClass(NormalModule, [
        {
            key: "identifier",
            value: function() {
                return "normal";
            }
        },
        {
            key: "size",
            value: function() {
                return 0;
            }
        }
    ]), NormalModule;
}(Module1);
