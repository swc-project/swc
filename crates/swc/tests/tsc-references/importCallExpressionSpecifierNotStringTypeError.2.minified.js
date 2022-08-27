//// [importCallExpressionSpecifierNotStringTypeError.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>_interopRequireWildcard(require(p)));
Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>_interopRequireWildcard(require(p))), p1.then((zero)=>zero.foo()), Promise.resolve([
    "path1",
    "path2"
]).then((p)=>_interopRequireWildcard(require(p))), Promise.resolve(()=>"PathToModule").then((p)=>_interopRequireWildcard(require(p)));
