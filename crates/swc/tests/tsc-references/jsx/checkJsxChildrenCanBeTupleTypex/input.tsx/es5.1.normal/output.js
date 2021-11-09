// @jsx: react
// @strict: true
// @esModuleInterop: true
/// <reference path="/.lib/react16.d.ts" />
import React from 'react';
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
var ResizablePanel = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(ResizablePanel, _Component);
    function ResizablePanel() {
        _classCallCheck(this, ResizablePanel);
        return _possibleConstructorReturn(this, _getPrototypeOf(ResizablePanel).apply(this, arguments));
    }
    return ResizablePanel;
}(React.Component);
var test = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
var testErr = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
