"use strict";
var _exports = {};
__export(_exports, {
    notExportName: function() {
        return notExportName;
    },
    shouldNotBeExportNameAsWell: function() {
        return shouldNotBeExportNameAsWell;
    },
    whatever: function() {
        return whatever;
    }
});
module.exports = __toCJS(_exports);
__reExport(_exports, require("another-module"), module.exports);
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
