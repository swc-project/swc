//// [importCallExpressionDeclarationEmit1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p0 = Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
function returnDynamicLoad(path) {
    return Promise.resolve(path).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
}
