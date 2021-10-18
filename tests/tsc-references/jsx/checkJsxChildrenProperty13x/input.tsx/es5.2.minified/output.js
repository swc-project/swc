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
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
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
}, React = require("react"), Button = function(_Component) {
    "use strict";
    function Button() {
        return _classCallCheck(this, Button), _possibleConstructorReturn(this, _getPrototypeOf(Button).apply(this, arguments));
    }
    return _inherits(Button, _Component), _createClass(Button, [
        {
            key: "render",
            value: function() {
                return React.createElement(InnerButton, _extends({
                }, this.props, {
                    children: "hi"
                }), React.createElement("div", null, "Hello World"));
            }
        }
    ]), Button;
}(React.Component), InnerButton = function(_Component) {
    "use strict";
    function InnerButton() {
        return _classCallCheck(this, InnerButton), _possibleConstructorReturn(this, _getPrototypeOf(InnerButton).apply(this, arguments));
    }
    return _inherits(InnerButton, _Component), _createClass(InnerButton, [
        {
            key: "render",
            value: function() {
                return React.createElement("button", null, "Hello");
            }
        }
    ]), InnerButton;
}(React.Component);
export { };
