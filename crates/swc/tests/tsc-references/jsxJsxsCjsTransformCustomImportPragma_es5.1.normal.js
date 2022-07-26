// @jsx: react-jsx,react-jsxdev
// @strict: true
// @module: commonjs
// @filename: preact.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
var a = /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
        /*#__PURE__*/ _jsx("p", {}),
        "text",
        /*#__PURE__*/ _jsx("div", {
            className: "foo"
        })
    ]
});
// @filename: react.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ import "./preact";
var a = /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
        /*#__PURE__*/ _jsx("p", {}),
        "text",
        /*#__PURE__*/ _jsx("div", {
            className: "foo"
        })
    ]
});
