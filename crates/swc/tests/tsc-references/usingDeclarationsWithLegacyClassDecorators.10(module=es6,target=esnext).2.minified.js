//// [usingDeclarationsWithLegacyClassDecorators.10.ts]
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx(), _class = class {
    };
    _class = _ts_decorate([
        dec
    ], _class), _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
export { _class as default };
