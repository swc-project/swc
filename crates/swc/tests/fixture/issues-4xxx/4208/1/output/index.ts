import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
export var CompanyBgStore = function CompanyBgStore() {
    "use strict";
    _class_call_check(this, CompanyBgStore);
    this.corpName = 123;
    var _this = this;
    this.getBusinessInfo = _async_to_generator(function() {
        var corpName;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            corpName = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : _this.corpName;
            console.log(corpName);
            return [
                2
            ];
        });
    });
};
