//// [importCallExpressionGrammarError.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var a = [
    "./0"
];
Promise.resolve(...[
    "PathModule"
]).then((p)=>_interopRequireWildcard(require(p)));
var p1 = Promise.resolve(...a).then((p)=>_interopRequireWildcard(require(p)));
const p2 = Promise.resolve().then((p)=>_interopRequireWildcard(require(p))), p4 = Promise.resolve().then(()=>_interopRequireWildcard(require("pathToModule", "secondModule")));
