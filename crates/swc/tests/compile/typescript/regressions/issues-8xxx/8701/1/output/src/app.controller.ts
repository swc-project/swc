import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { Controller, Get } from "@nestjs/common";
export var AppController = /*#__PURE__*/ function() {
    "use strict";
    function AppController(appService) {
        _class_call_check(this, AppController);
        _define_property(this, "appService", void 0);
        this.appService = appService;
    }
    _create_class(AppController, [
        {
            key: "getHello",
            value: function getHello() {
                return this.appService.getHello();
            }
        }
    ]);
    return AppController;
}();
_ts_decorate([
    Get()
], AppController.prototype, "getHello", null);
AppController = _ts_decorate([
    Controller()
], AppController);
