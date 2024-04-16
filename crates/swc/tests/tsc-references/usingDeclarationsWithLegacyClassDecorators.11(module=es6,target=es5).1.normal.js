//// [usingDeclarationsWithLegacyClassDecorators.11.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
export { C };
try {
    var _usingCtx = _using_ctx();
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    C = _ts_decorate([
        dec
    ], C);
    var after = _usingCtx.u(null);
} catch (_) {
    _usingCtx.e = _;
} finally{
    _usingCtx.d();
}
