//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
export { _class as default };
try {
    var _usingCtx = _using_ctx();
    var _class = class _class {
    };
    _class = _ts_decorate([
        dec
    ], _class);
    var after = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
