import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { Injectable } from "@nestjs/common";
export var AppService = /*#__PURE__*/ function() {
    "use strict";
    function AppService() {
        _class_call_check(this, AppService);
    }
    _create_class(AppService, [
        {
            key: "getHello",
            value: function getHello() {
                return 'Hello World!';
            }
        }
    ]);
    return AppService;
}();
AppService = _ts_decorate([
    Injectable()
], AppService);
