"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPackage = getPackage;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve(`${(0, _path).join(process.cwd(), "package.json")}`).then(function(s) {
        return _interop_require_wildcard(require(s));
    });
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
