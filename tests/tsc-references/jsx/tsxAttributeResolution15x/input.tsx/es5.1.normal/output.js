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
var _this = this;
// @filename: file.tsx
// @jsx: preserve
// @noLib: true
// @skipLibCheck: true
// @noImplicitAny: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var BigGreeter = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(BigGreeter, _Component);
    function BigGreeter() {
        _classCallCheck(this, BigGreeter);
        return _possibleConstructorReturn(this, _getPrototypeOf(BigGreeter).apply(this, arguments));
    }
    _createClass(BigGreeter, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null, "Default hi"));
            }
        }
    ]);
    return BigGreeter;
}(React.Component);
// Error
var a = /*#__PURE__*/ React.createElement(BigGreeter, {
    prop1: "hello"
});
// OK
var b = /*#__PURE__*/ React.createElement(BigGreeter, {
    ref: function(input) {
        _this.textInput = input;
    }
});
var c = /*#__PURE__*/ React.createElement(BigGreeter, {
    "data-extra": "hi"
});
export { };
