//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var _jsxdevruntime = require("react/jsx-dev-runtime");
var _react = require("react");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", _object_spread_props._(_object_spread._({}, props), {
    children: "text"
}), "foo", false, {
    fileName: "preact.tsx",
    lineNumber: 4,
    columnNumber: 11
}, void 0);
var b = /*#__PURE__*/ (0, _react.createElement)("div", _object_spread_props._(_object_spread._({}, props), {
    key: "bar",
    __source: {
        fileName: "preact.tsx",
        lineNumber: 5,
        columnNumber: 11
    },
    __self: void 0
}), "text");
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var _jsxdevruntime = require("react/jsx-dev-runtime");
var _react = require("react");
require("./preact");
var props2 = {
    answer: 42
};
var a2 = /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", _object_spread_props._(_object_spread._({}, props2), {
    children: "text"
}), "foo", false, {
    fileName: "react.tsx",
    lineNumber: 5,
    columnNumber: 12
}, void 0);
var b2 = /*#__PURE__*/ (0, _react.createElement)("div", _object_spread_props._(_object_spread._({}, props2), {
    key: "bar",
    __source: {
        fileName: "react.tsx",
        lineNumber: 6,
        columnNumber: 12
    },
    __self: void 0
}), "text");
