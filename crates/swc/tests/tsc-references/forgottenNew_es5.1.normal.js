import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Tools;
(function(Tools) {
    var NullLogger = function NullLogger() {
        "use strict";
        _class_call_check(this, NullLogger);
    };
    Tools.NullLogger = NullLogger;
})(Tools || (Tools = {}));
var logger = Tools.NullLogger();
