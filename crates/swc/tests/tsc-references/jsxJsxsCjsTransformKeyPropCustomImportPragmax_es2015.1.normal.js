import { jsx as _jsx } from "preact/jsx-runtime";
import { createElement as _createElement } from "react";
// @filename: react.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ import "./preact";
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
// @jsx: react-jsx,react-jsxdev
// @strict: true
// @module: commonjs
// @filename: preact.tsx
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ const props = {
    answer: 42
};
const a = /*#__PURE__*/ _jsx("div", _objectSpread({
}, props, {
    children: "text"
}), "foo");
const b = /*#__PURE__*/ _createElement("div", _objectSpread({
}, props, {
    key: "bar",
    children: "text"
}));
const props2 = {
    answer: 42
};
const a2 = /*#__PURE__*/ _jsx("div", _objectSpread({
}, props2, {
    children: "text"
}), "foo");
const b2 = /*#__PURE__*/ _createElement("div", _objectSpread({
}, props2, {
    key: "bar",
    children: "text"
}));
