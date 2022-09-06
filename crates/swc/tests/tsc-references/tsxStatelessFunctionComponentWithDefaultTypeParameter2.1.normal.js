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
    function MyComponent1(attr) {
        return /*#__PURE__*/ _react.createElement("div", null, "attr.values");
    }
    // Error
    var i1 = /*#__PURE__*/ _react.createElement(MyComponent1, {
        values: 5
    });
});
