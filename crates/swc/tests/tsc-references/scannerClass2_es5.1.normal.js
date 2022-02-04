function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
export var LoggerAdapter = function LoggerAdapter(logger) {
    "use strict";
    _classCallCheck(this, LoggerAdapter);
    this.logger = logger;
    this._information = this.logger.information();
};
