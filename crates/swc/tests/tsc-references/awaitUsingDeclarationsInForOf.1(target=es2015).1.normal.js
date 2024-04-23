//// [awaitUsingDeclarationsInForOf.1.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _using_ctx } from "@swc/helpers/_/_using_ctx";
function main() {
    return _main.apply(this, arguments);
}
function _main() {
    _main = _async_to_generator(function*() {
        for (const d1 of [
            {
                [Symbol.asyncDispose] () {
                    return _async_to_generator(function*() {})();
                }
            },
            {
                [Symbol.dispose] () {}
            },
            null,
            undefined
        ]){
            try {
                var _usingCtx = _using_ctx();
                {}
            } catch (_) {
                _usingCtx.e = _;
            } finally{
                _usingCtx.d();
            }
        }
    });
    return _main.apply(this, arguments);
}
