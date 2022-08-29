//// [importCallExpressionSpecifierNotStringTypeError.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
// Error specifier is not assignable to string
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
p1.then((zero)=>{
    return zero.foo(); // ok, zero is any
});
var p3 = Promise.resolve([
    "path1",
    "path2"
]).then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
var p4 = Promise.resolve(()=>"PathToModule").then((p)=>/*#__PURE__*/ _interopRequireWildcard(require(p)));
