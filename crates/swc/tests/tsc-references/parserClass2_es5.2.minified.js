import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var LoggerAdapter = function(logger) {
    "use strict";
    _class_call_check(this, LoggerAdapter), this.logger = logger, this._information = this.logger.information();
};
