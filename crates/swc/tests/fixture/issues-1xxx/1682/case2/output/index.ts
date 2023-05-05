"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPackage", {
    enumerable: true,
    get: function() {
        return getPackage;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve((0, _path.join)(process.cwd(), "package.json")).then((p)=>/*#__PURE__*/ _interop_require_wildcard._(require(p)));
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
