//// [preact.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxruntime = require("preact/jsx-runtime");
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ var a = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
    children: [
        /*#__PURE__*/ (0, _jsxruntime.jsx)("p", {}),
        "text",
        /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
            className: "foo"
        })
    ]
});
//// [react.tsx]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxruntime = require("react/jsx-runtime");
require("./preact");
var a = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
    children: [
        /*#__PURE__*/ (0, _jsxruntime.jsx)("p", {}),
        "text",
        /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
            className: "foo"
        })
    ]
});
