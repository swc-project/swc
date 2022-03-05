import * as swcHelpers from "@swc/helpers";
export var LoggerAdapter = function LoggerAdapter(logger) {
    "use strict";
    swcHelpers.classCallCheck(this, LoggerAdapter);
    this.logger = logger;
    this._information = this.logger.information();
};
