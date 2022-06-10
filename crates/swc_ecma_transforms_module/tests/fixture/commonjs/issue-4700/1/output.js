"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
    whatever: true
};
exports.whatever = whatever;
var _anotherModule = require("another-module");
Object.keys(_anotherModule).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _anotherModule[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _anotherModule[key];
        }
    });
});
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
