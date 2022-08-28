//// [decoratorOnClassMethodParameter1.es6.ts]
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
class _class {
    method(p) {}
}
_ts_decorate([
    _ts_param(0, dec)
], _class.prototype, "method", null);
export { _class as default };
