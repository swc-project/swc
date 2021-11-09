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
var d, d2, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "thing",
            value: function() {
            }
        }
    ], [
        {
            key: "other",
            value: function() {
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    function D() {
        return _classCallCheck(this, D), _possibleConstructorReturn(this, _getPrototypeOf(D).apply(this, arguments));
    }
    return _inherits(D, C), D;
}(C);
d.foo, d.bar, d.thing(), D.other();
var C2 = function() {
    "use strict";
    function C2() {
        _classCallCheck(this, C2);
    }
    return _createClass(C2, [
        {
            key: "thing",
            value: function(x) {
            }
        }
    ], [
        {
            key: "other",
            value: function(x) {
            }
        }
    ]), C2;
}(), D2 = function(C2) {
    "use strict";
    function D2() {
        return _classCallCheck(this, D2), _possibleConstructorReturn(this, _getPrototypeOf(D2).apply(this, arguments));
    }
    return _inherits(D2, C2), D2;
}(C2);
d2.foo, d2.bar, d2.thing(""), D2.other(1);
