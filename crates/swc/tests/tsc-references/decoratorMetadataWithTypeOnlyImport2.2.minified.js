//// [decoratorMetadataWithTypeOnlyImport2.ts]
//// [services.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(Services || (Services = {})).Service = function Service() {
    _class_call_check(this, Service);
};
export var Services;
//// [index.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_metadata } from "@swc/helpers/_/_ts_metadata";
export var Main = function Main() {
    _class_call_check(this, Main);
};
_ts_decorate([
    decorator(),
    _ts_metadata("design:type", "undefined" == typeof Services || void 0 === Services.Service ? Object : Services.Service)
], Main.prototype, "field", void 0);
