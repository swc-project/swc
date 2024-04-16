//// [usingDeclarationsWithLegacyClassDecorators.1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
try {
    var _usingCtx = _using_ctx();
    var before = _usingCtx.u(null);
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    C = _ts_decorate([
        dec
    ], C);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
export { };
