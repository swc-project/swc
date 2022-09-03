//// [importCallExpressionDeclarationEmit1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
var p0 = Promise.resolve(`${directory}\\${moduleFile}`).then((p)=>_interopRequireWildcard(require(p))), p1 = Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>_interopRequireWildcard(require(p)));
function returnDynamicLoad(path) {
    return Promise.resolve(path).then((p)=>_interopRequireWildcard(require(p)));
}
