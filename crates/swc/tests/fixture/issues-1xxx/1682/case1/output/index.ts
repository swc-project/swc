"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    getPackage: function() {
        return getPackage;
    }
});
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
var _path = require("path");
async function getPackage() {
    const pkg = await Promise.resolve((0, _path.join)(process.cwd(), "package.json")).then(function(p) {
        return _interop_require_wildcard(require(p));
    });
    return pkg.default || pkg;
}
(async function() {
    const pkg = await getPackage();
    console.log(pkg);
})();
