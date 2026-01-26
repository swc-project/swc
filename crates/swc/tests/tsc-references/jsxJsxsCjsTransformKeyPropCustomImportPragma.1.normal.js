//// [preact.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var _jsxruntime = require("preact/jsx-runtime");
var _preact = require("preact");
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ var props = {
    answer: 42
};
var a = /*#__PURE__*/ (0, _jsxruntime.jsx)("div", _object_spread_props._(_object_spread._({}, props), {
    children: "text"
}), "foo");
var b = /*#__PURE__*/ (0, _preact.createElement)("div", _object_spread_props._(_object_spread._({}, props), {
    key: "bar"
}), "text");
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var _jsxruntime = require("react/jsx-runtime");
var _react = require("react");
require("./preact");
var props2 = {
    answer: 42
};
var a2 = /*#__PURE__*/ (0, _jsxruntime.jsx)("div", _object_spread_props._(_object_spread._({}, props2), {
    children: "text"
}), "foo");
var b2 = /*#__PURE__*/ (0, _react.createElement)("div", _object_spread_props._(_object_spread._({}, props2), {
    key: "bar"
}), "text");
