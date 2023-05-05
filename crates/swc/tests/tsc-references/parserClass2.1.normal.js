//// [parserClass2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var LoggerAdapter = function LoggerAdapter(logger) {
    "use strict";
    _class_call_check(this, LoggerAdapter);
    this.logger = logger;
    this._information = this.logger.information();
};
