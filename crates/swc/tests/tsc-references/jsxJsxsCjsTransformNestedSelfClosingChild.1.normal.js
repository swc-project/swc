//// [jsxJsxsCjsTransformNestedSelfClosingChild.tsx]
/// <reference path="/.lib/react16.d.ts" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
console.log(/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", null)));
console.log(/*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null)));
console.log(/*#__PURE__*/ React.createElement("div", null, [
    1,
    2
].map(function(i) {
    return /*#__PURE__*/ React.createElement("div", {
        key: i
    }, i);
})));
