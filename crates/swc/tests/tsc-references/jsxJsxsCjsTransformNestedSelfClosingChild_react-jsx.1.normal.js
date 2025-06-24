//// [jsxJsxsCjsTransformNestedSelfClosingChild.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxruntime = require("react/jsx-runtime");
console.log(/*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
    children: /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {})
}));
console.log(/*#__PURE__*/ (0, _jsxruntime.jsxs)("div", {
    children: [
        /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {}),
        /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {})
    ]
}));
console.log(/*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
    children: [
        1,
        2
    ].map(function(i) {
        return /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
            children: i
        }, i);
    })
}));
