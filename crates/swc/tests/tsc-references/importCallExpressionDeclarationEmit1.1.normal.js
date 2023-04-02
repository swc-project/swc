//// [importCallExpressionDeclarationEmit1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
var p0 = Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
function returnDynamicLoad(path) {
    return Promise.resolve(path).then((p)=>/*#__PURE__*/ _interop_require_wildcard(require(p)));
}
