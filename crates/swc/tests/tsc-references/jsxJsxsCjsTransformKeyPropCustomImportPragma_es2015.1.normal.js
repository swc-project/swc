import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
// @filename: react.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ import "./preact";
// @jsx: react-jsx,react-jsxdev
// @strict: true
// @module: commonjs
// @filename: preact.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ const props = {
    answer: 42
};
const a = /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, props), {
    children: "text"
}), "foo");
const b = /*#__PURE__*/ _createElement("div", _object_spread_props(_object_spread({}, props), {
    key: "bar"
}), "text");
const props2 = {
    answer: 42
};
const a2 = /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, props2), {
    children: "text"
}), "foo");
const b2 = /*#__PURE__*/ _createElement("div", _object_spread_props(_object_spread({}, props2), {
    key: "bar"
}), "text");
