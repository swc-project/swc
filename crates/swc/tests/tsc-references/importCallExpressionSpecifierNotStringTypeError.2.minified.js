//// [importCallExpressionSpecifierNotStringTypeError.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
var p1 = Promise.resolve(getSpecifier()).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
Promise.resolve(whatToLoad ? getSpecifier() : "defaulPath").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p))), p1.then((zero)=>zero.foo()), Promise.resolve([
    "path1",
    "path2"
]).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p))), Promise.resolve(()=>"PathToModule").then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
