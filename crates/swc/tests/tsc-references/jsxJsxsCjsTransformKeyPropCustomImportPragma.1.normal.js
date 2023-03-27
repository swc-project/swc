//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default;
var _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
var _jsx_runtime = require("preact/jsx-runtime");
var _preact = require("preact");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ (0, _jsx_runtime.jsx)("div", _object_spread_props(_object_spread({}, props), {
    children: "text"
}), "foo");
var b = /*#__PURE__*/ (0, _preact.createElement)("div", _object_spread_props(_object_spread({}, props), {
    key: "bar"
}), "text");
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/lib/_object_spread.js").default;
var _object_spread_props = require("@swc/helpers/lib/_object_spread_props.js").default;
var _jsx_runtime = require("react/jsx-runtime");
var _react = require("react");
require("./preact");
var props2 = {
    answer: 42
};
var a2 = /*#__PURE__*/ (0, _jsx_runtime.jsx)("div", _object_spread_props(_object_spread({}, props2), {
    children: "text"
}), "foo");
var b2 = /*#__PURE__*/ (0, _react.createElement)("div", _object_spread_props(_object_spread({}, props2), {
    key: "bar"
}), "text");
