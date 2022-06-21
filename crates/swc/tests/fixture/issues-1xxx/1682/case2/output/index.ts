"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPackage", {
    get: ()=>getPackage,
    enumerable: true
});
const _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve((0, _path.join)(process.cwd(), "package.json")).then((p)=>_interopRequireWildcardMjs(require(p)));
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
