//// [jsxJsxsCjsTransformKeyProp.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var _jsxruntime = require("react/jsx-runtime");
var _react = require("react");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ (0, _jsxruntime.jsx)("div", _object_spread_props._(_object_spread._({}, props), {
    children: "text"
}), "foo");
var b = /*#__PURE__*/ (0, _react.createElement)("div", _object_spread_props._(_object_spread._({}, props), {
    key: "bar"
}), "text");
