//// [importCallExpressionGrammarError.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var a = [
    "./0"
];
Promise.resolve(...[
    "PathModule"
]).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p1 = Promise.resolve(...a).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const p2 = Promise.resolve().then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const p4 = Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("pathToModule", "secondModule")));
