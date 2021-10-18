function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Tools;
(function(Tools) {
    var NullLogger = function NullLogger() {
        "use strict";
        _classCallCheck(this, NullLogger);
    };
    Tools.NullLogger = NullLogger;
})(Tools || (Tools = {
}));
var logger = Tools.NullLogger();
