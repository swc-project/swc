//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default;
var _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
var _jsxRuntime = require("preact/jsx-runtime");
var _react = require("react");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ (0, _jsxRuntime.jsx)("div", _objectSpreadProps(_objectSpread({}, props), {
    children: "text"
}), "foo");
var b = /*#__PURE__*/ (0, _react.createElement)("div", _objectSpreadProps(_objectSpread({}, props), {
    key: "bar"
}), "text");
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _objectSpread = require("@swc/helpers/lib/_object_spread.js").default;
var _objectSpreadProps = require("@swc/helpers/lib/_object_spread_props.js").default;
var _jsxRuntime = require("react/jsx-runtime");
var _react = require("react");
require("./preact");
var props2 = {
    answer: 42
};
var a2 = /*#__PURE__*/ (0, _jsxRuntime.jsx)("div", _objectSpreadProps(_objectSpread({}, props2), {
    children: "text"
}), "foo");
var b2 = /*#__PURE__*/ (0, _react.createElement)("div", _objectSpreadProps(_objectSpread({}, props2), {
    key: "bar"
}), "text");
