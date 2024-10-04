//// [decoratorMetadataWithTypeOnlyImport2.ts]
//// [services.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(Services) {
    var Service = function Service() {
        "use strict";
        _class_call_check(this, Service);
    };
    Services.Service = Service;
})(Services || (Services = {}));
export var Services;
//// [index.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
export var Main = function Main() {
    "use strict";
    _class_call_check(this, Main);
};
_ts_decorate([
    decorator(),
    _ts_metadata("design:type", typeof Services === "undefined" || typeof Services.Service === "undefined" ? Object : Services.Service)
], Main.prototype, "field", void 0);
