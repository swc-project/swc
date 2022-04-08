"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPackage = getPackage;
var swcHelpers = require("@swc/helpers");
var _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve(`${(0, _path).join(process.cwd(), 'package.json')}`).then(function(s) {
        return swcHelpers.interopRequireWildcard(require(s));
    });
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
