//// [preact.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource preact */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var a = /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null), "text", /*#__PURE__*/ React.createElement("div", {
    className: "foo"
}));
//// [react.tsx]
/// <reference path="/.lib/react16.d.ts" />
/* @jsxImportSource react */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
require("./preact");
var a = /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("p", null), "text", /*#__PURE__*/ React.createElement("div", {
    className: "foo"
}));
