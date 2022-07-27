// @jsx: react-jsx,react-jsxdev
// @strict: true
// @module: commonjs
// @filename: preact.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
const a = /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
        /*#__PURE__*/ _jsx("p", {}),
        "text",
        /*#__PURE__*/ _jsx("div", {
            className: "foo"
        })
    ]
});
export { };
// @filename: react.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./preact";
const a = /*#__PURE__*/ _jsxs(_Fragment, {
    children: [
        /*#__PURE__*/ _jsx("p", {}),
        "text",
        /*#__PURE__*/ _jsx("div", {
            className: "foo"
        })
    ]
});
