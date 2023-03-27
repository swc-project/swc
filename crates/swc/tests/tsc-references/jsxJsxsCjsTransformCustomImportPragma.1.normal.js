//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsx_runtime = require("preact/jsx-runtime");
var a = /*#__PURE__*/ (0, _jsx_runtime.jsxs)(_jsx_runtime.Fragment, {
    children: [
        /*#__PURE__*/ (0, _jsx_runtime.jsx)("p", {}),
        "text",
        /*#__PURE__*/ (0, _jsx_runtime.jsx)("div", {
            className: "foo"
        })
    ]
});
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsx_runtime = require("react/jsx-runtime");
require("./preact");
var a = /*#__PURE__*/ (0, _jsx_runtime.jsxs)(_jsx_runtime.Fragment, {
    children: [
        /*#__PURE__*/ (0, _jsx_runtime.jsx)("p", {}),
        "text",
        /*#__PURE__*/ (0, _jsx_runtime.jsx)("div", {
            className: "foo"
        })
    ]
});
