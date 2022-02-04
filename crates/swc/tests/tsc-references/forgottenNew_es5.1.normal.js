function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Tools;
(function(Tools1) {
    var NullLogger = function NullLogger() {
        "use strict";
        _classCallCheck(this, NullLogger);
    };
    Tools1.NullLogger = NullLogger;
})(Tools || (Tools = {}));
var logger = Tools.NullLogger();
