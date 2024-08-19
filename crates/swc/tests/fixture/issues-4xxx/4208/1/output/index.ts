import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
export var CompanyBgStore = function CompanyBgStore() {
    "use strict";
    _class_call_check(this, CompanyBgStore);
    var _this = this;
    _define_property(this, "corpName", 123);
    _define_property(this, "getBusinessInfo", /*#__PURE__*/ _async_to_generator(function() {
        var corpName;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            corpName = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : _this.corpName;
            console.log(corpName);
            return [
                2
            ];
        });
    }));
};
