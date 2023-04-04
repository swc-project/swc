//// [importCallExpressionSpecifierNotStringTypeError.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
// Error specifier is not assignable to string
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
const p2 = Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
p1.then((zero)=>{
    return zero.foo(); // ok, zero is any
});
var p3 = Promise.resolve([
    "path1",
    "path2"
]).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p4 = Promise.resolve(()=>"PathToModule").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
