//// [decoratorOnClassAccessor1.es6.ts]
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
class _class {
    get accessor() {
        return 1;
    }
}
export { _class as default };
_ts_decorate([
    dec
], _class.prototype, "accessor", null);
