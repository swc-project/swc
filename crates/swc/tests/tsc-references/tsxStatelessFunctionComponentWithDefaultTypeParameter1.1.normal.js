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
    function MyComponent(attr) {
        return /*#__PURE__*/ _react.createElement("div", null, "attr.values");
    }
    // OK
    var i = /*#__PURE__*/ _react.createElement(MyComponent, {
        values: true
    }); // We infer type arguments here
    var i1 = /*#__PURE__*/ _react.createElement(MyComponent, {
        values: "Hello"
    });
});
