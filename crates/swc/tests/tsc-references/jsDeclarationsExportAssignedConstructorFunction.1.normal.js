//// [jsDeclarationsExportAssignedConstructorFunction.js]
/** @constructor */ module.exports.MyClass = function() {
    this.x = 1;
};
module.exports.MyClass.prototype = {
    a: function a() {}
};
