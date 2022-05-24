import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var LoggerAdapter = function LoggerAdapter(logger) {
    "use strict";
    _class_call_check(this, LoggerAdapter);
    this.logger = logger;
    this._information = this.logger.information();
};
