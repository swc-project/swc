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
var unionNumberString, unionDE, num, str, c, d, e, anyVar, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function(C) {
    "use strict";
    function D() {
        return _classCallCheck(this, D), _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
    }
    return _inherits(D, C), _createClass(D, [
        {
            key: "foo1",
            value: function() {
            }
        }
    ]), D;
}(C), E = function(C) {
    "use strict";
    function E() {
        return _classCallCheck(this, E), _possibleConstructorReturn(this, _getPrototypeOf(E).apply(this, arguments));
    }
    return _inherits(E, C), _createClass(E, [
        {
            key: "foo2",
            value: function() {
            }
        }
    ]), E;
}(C);
c = d, c = e, c = unionDE, d = d, d = e, e = e = d = unionDE, e = unionDE, num = num, num = str, num = unionNumberString, str = num, str = str, str = unionNumberString, d = c, e = c, unionDE = c, d = d, e = d, unionDE = d, d = e, e = e, unionDE = e, num = num, str = num, unionNumberString = num, num = str, str = str, unionNumberString = str, anyVar = unionDE, anyVar = unionNumberString, unionDE = anyVar, unionNumberString = anyVar, unionDE = null, unionNumberString = null, unionDE = void 0, unionNumberString = void 0;
