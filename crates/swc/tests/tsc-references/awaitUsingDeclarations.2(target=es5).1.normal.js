//// [awaitUsingDeclarations.2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        var d1 = _usingCtx.a(_define_property({}, Symbol.asyncDispose, function() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    return [
                        2
                    ];
                });
            })();
        })), d2 = _usingCtx.a(_define_property({}, Symbol.asyncDispose, function() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    return [
                        2
                    ];
                });
            })();
        }));
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}export { };
