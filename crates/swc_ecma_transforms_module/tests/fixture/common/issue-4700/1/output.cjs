"use strict";
__export(exports, {
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
module.exports = __toCJS(exports);
__reExport(exports, require("another-module"), module.exports);
function whatever(notExportName) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
