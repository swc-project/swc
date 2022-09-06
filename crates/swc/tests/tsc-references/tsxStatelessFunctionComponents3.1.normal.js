//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Foo = function(props) {
        return /*#__PURE__*/ _react.createElement("div", null);
    };
    // Should be OK
    var foo = /*#__PURE__*/ _react.createElement(Foo, null);
    // Should be OK
    var MainMenu = function(props) {
        return /*#__PURE__*/ _react.createElement("div", null, /*#__PURE__*/ _react.createElement("h3", null, "Main Menu"));
    };
    var App = function(param) {
        var children = param.children;
        return /*#__PURE__*/ _react.createElement("div", null, /*#__PURE__*/ _react.createElement(MainMenu, null));
    };
});
