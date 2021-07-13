"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPackage = getPackage;
var swcHelpers = require("@swc/helpers");
var _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve().then(function() {
        return swcHelpers.interopRequireWildcard(require(join(process.cwd(), 'package.json')));
    });
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
