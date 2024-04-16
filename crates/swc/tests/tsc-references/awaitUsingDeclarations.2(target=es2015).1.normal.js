//// [awaitUsingDeclarations.2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
{
    try {
        var _usingCtx = _using_ctx();
        const d1 = _usingCtx.a({
            [Symbol.asyncDispose] () {
                return _async_to_generator(function*() {})();
            }
        }), d2 = _usingCtx.a({
            [Symbol.asyncDispose] () {
                return _async_to_generator(function*() {})();
            }
        });
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        await _usingCtx.d();
    }
}export { };
