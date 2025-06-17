//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _object_spread = require("@swc/helpers/_/_object_spread");
var _object_spread_props = require("@swc/helpers/_/_object_spread_props");
var props = {
    answer: 42
};
var a = /*#__PURE__*/ React.createElement("div", _object_spread._({
    key: "foo"
}, props), "text");
var b = /*#__PURE__*/ React.createElement("div", _object_spread_props._(_object_spread._({}, props), {
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
require("./preact");
var props2 = {
    answer: 42
};
var a2 = /*#__PURE__*/ React.createElement("div", _object_spread._({
    key: "foo"
}, props2), "text");
var b2 = /*#__PURE__*/ React.createElement("div", _object_spread_props._(_object_spread._({}, props2), {
    key: "bar"
}), "text");
